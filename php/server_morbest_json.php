<?php
$debug = 0;

$http_origin = $_SERVER['HTTP_ORIGIN'];

if (
	$http_origin == "http://localhost:9002" || //local live-reload development
	$http_origin == "http://pma.co.il" || //server
	$http_origin == "http://morbest" //local php server
	)
		{  
		    header("Access-Control-Allow-Origin: $http_origin");
		}

ini_set('display_errors', 'On');
error_reporting(E_ALL);
require_once("db_connect.php");
$link = do_connection() or die("no db connection");
if ($debug) {
	echo "<pre>";
	print_r($link);
	echo "</pre>";
}
// require_once('the_loadfile_function.php');

// echo "<pre>";
//     print_r($_REQUEST);
//     echo "</pre>";

//this is in case of post data
$postdata = file_get_contents("php://input");
    $request = json_decode($postdata,true);
    @$request_url = $request["rq_url"];
    @$data = $request["data"];
    @extract($data);
    // @$symbol = $data["symbol"];

if ($request_url == 'SetCookie') {
	$CookieString = md5($milli);
	$query="INSERT INTO `Cookies` SET `CookieString` = '$CookieString', `CookieDate` = '$milli'";
	run_query($link, $query);
	echo $CookieString;
}
if ($request_url == 'GetCookie') {
	if (!isset($md5)) die("didn't get valid md5 variable to look up");
	$query="SELECT `CookieID` FROM `Cookies` WHERE `CookieString` = '$md5'";
	// echo $query;
	$row = get_query_data($link, $query);
	$user_id = $row[0]["CookieID"];
	echo $user_id;
	// print_r($row);
}


//getallusstocks
// e.g: server_json.php?getallusstocks
if ($request_url == 'testingservice') {
	// calc_all_bm(1);
	//$query comes from extract above
	//there functions are in do_connect.php
	$our_data = get_query_data($link, $query);
	$our_headers = get_col_headers($link, $query);
	echo json_encode(Array($our_data,$our_headers),true);
}
if ($request_url == 'calcservice') {

	$country_id = get_cell($link, 'countries', 'country_id', 'Name', $country);
	$makam_id = get_cell($link, 'risk_free_bm_by_country', 'bm_id', 'country_id', $country_id);
	
	//done for 2015
	// echo "$country_id,$makam_id";
	save_yearly_calcs($link,$country_id,$makam_id);
}
//todo:
//the getquestions should return data for specific user
if ($request_url == 'getquestions') {
	$query = "SELECT `answers`.`QuestionID`, `answers`.`AnswerNum`, `answers`.`ShortAnswerDes`, `answers`.`AnswerDes`, `answers`.`AnswerVar`, `answers`.`Weight`, `questions`.`QuestionDes`, `questions`.`min_weight`, `questions`.`max_weight`, `questions`.`q_name` FROM `answers` LEFT JOIN `questions` ON `answers`.`QuestionID`=`questions`.`QuestionID` order by questionid asc, answernum asc";
	$our_data = get_query_data($link, $query);
	debugData("\nGot request $request_url. Executed query: $query. received: " . json_encode($our_data));
	echo json_encode($our_data,true);
}
if ($request_url == 'getuseranswers') {
	//get an array of question id's with an answer for each, if exists
	$query = "SELECT * FROM `user_answers` WHERE `userId`='$userId'";
	$our_data = get_query_data($link, $query);
	echo json_encode($our_data, true);
}
if ($request_url == 'updateUserAnswer') {
	$query = "INSERT INTO `user_answers` SET `userId`='$userId', `QuestionId`='$questionId', `shortAnswer`='$shortAnswer', `updateDate`='$updateDate' ON DUPLICATE KEY UPDATE `shortAnswer`='$shortAnswer', `updateDate`='$updateDate'";
	run_query($link, $query);
	echo $query;
	$query = "UPDATE `cookies` SET `total_risk`='$totalrisk', `client_rank`='$clientrank' WHERE `CookieID`='$cookieid'";
	run_query($link, $query);
}

if ($request_url == 'maslulservice') {
//nothing yet
}
//calculates to benchmark_results
function save_yearly_calcs($link,$country_id,$makam_id)
{
	// echo "makamid: $makam_id";
	run_query($link, "truncate `benchmark_results`");
	$last_year = date("Y")-1;
	$tesuah_makam = tesuah_bm($link, $makam_id);
	$query="SELECT * FROM `benchmark_summary` WHERE `country_code`='$country_id' ORDER BY `benchmark_number` ASC";
	$our_data = get_query_data($link, $query);
	for ($i=0; $i<count($our_data); $i++) {
		$benchmark_number = $our_data[$i]["benchmark_number"];
		$sd_yearly = calculate_sd_annual_data($link, $benchmark_number);
		$yearly_tesuah = tesuah_bm($link, $benchmark_number);
		$sharp = ($yearly_tesuah - $tesuah_makam) / $sd_yearly;
		$yearly_gap = ($yearly_tesuah - $tesuah_makam);
		$eng_name = $our_data[$i]["eng_name"];
		$query="INSERT INTO `benchmark_results` SET `benchmark_number`='$benchmark_number', `annual_yield`='$yearly_tesuah', `standard_d`='$sd_yearly', `index_sharp`='$sharp', `year`='$last_year', `name`='$eng_name'";
		// echo $query; die();
		run_query($link, $query);
		echo "\n $benchmark_number: yield: $yearly_tesuah sd: $sd_yearly sharp: $sharp yearly gap: $yearly_gap";

		
	}
}

//$table_name=countries, $field_name=country_id, $field_value=requested variable criteria

function get_cell($link, $table_name, $field_name, $field_id, $field_value){
	$return_value = -1;
	$query = "SELECT `$field_name` FROM `$table_name` WHERE `$field_id`='$field_value'";
	if ($result = mysqli_query($link, $query)) {
		$row = mysqli_fetch_assoc($result);
		$return_value = $row[$field_name];
		mysqli_free_result($result);
	}
	else die($query);
	return $return_value;
}
function country_id_from_country($country) {
	$country_id = -1;
	$query = "SELECT `country_id` FROM `countries` WHERE `Name`='$country'";
	if ($result = mysqli_query($link, $query)) {
		$row = mysqli_fetch_assoc($result);
		$country_id = $row["country_id"];
		mysqli_free_result($result);

	}
	return $country_id;
}

function calc_all_bm($country_id){
	$bm_id = risk_free_id_by_country_id($country_id);
	calculate_bm_annual_data($bm_id);

	$query = "SELECT `benchmark_number` FROM `benchmark_summary` WHERE 1";
	if ($result = mysqli_query($link, $query)) {
		while ($row = mysqli_fetch_assoc($result)) {
			$benchmark_number = $row["benchmark_number"];
			calculate_bm_annual_data($benchmark_number, $bm_id);
		}
		mysqli_free_result($result);
	}
}

function tesuah_bm($link, $bm_number) {
	$last_year = date("Y")-1;

	$query="SELECT * FROM `benchmark_data` WHERE `benchmark_number`='$bm_number' ORDER BY `date` DESC";//newest first
	$data = get_query_data($link, $query);
	$len = count($data);
	$newest_price = $data[0]["close_price"];
	$oldest_price = $data[$len-1]["close_price"];
	if ($oldest_price == 0) {
		echo $query;
		print_r($data);
		die();
	}
	$annual_yield_percent = (($newest_price/$oldest_price)-1);
	return $annual_yield_percent;
}
function calculate_sd_annual_data($link, $bm_number) {
	$last_year = date("Y")-1;

	$query="SELECT * FROM `benchmark_data` WHERE `benchmark_number`='$bm_number' ORDER BY `date` DESC";//newest first
	$data = get_query_data($link, $query);
	$len = count($data);
	$newest_price = $data[0]["close_price"];
	$oldest_price = $data[$len-1]["close_price"];
	$annual_yield_percent = (($newest_price-$oldest_price)-1)*100;
	$sum=0;
	for ($i=0; $i<$len-1; $i++) {
		//tesuah yomit
		// echo "\n" . $data[$i]["date"] . " " . $data[$i]["close_price"];
		$data[$i]["close_price"] = (($data[$i]["close_price"]/$data[$i+1]["close_price"])-1);
		// echo round($data[$i]["close_price"] .",";
		// echo " " . $data[$i]["close_price"];
		//sum of daily yields
		$sum += $data[$i]["close_price"];
	}
	//memutzah of daily yields
	$mean = $sum / $len;
	// echo "\nmimutzah is $mean";
	$sum = 0;
	for ($i=0; $i<$len-1; $i++) {
		//this is yield
		//$data[$i]["close_price"] is tesuah yomit
		$sum += pow(($data[$i]["close_price"] - $mean),2);
	}
	$variance = $sum/($len-1);
	$sd = sqrt($variance);
	// echo "\nsd is $sd";
	$sd = sqrt($len)*$sd;// ."%\n";
	return $sd;
	//echo "\n<brsd: $sd annual yield percent: $annual_yield_percent"; 
	//output into benchmark_results
	//lookup in benchmark_data where benchmark_number=$bm_number

}
function debugData($message) {
	file_put_contents("debug.txt", $message, FILE_APPEND);
}