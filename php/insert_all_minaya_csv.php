<?php
header('Content-Type: text/html; charset=UTF-8');
setlocale(LC_ALL, 'he_IL');
$num_days=0;
ini_set('memory_limit','600M');
ini_set('max_execution_time',9999999);
require_once("./db_connect.php");
$tmp_arr = do_connection();
if (is_array($tmp_arr))
{
	list($link_admin,$link, $link_pma) = $tmp_arr;
}
else die("prblem");

//create table on start
$query = "CREATE TABLE IF NOT EXISTS `minaya_names` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `minaya_name` text COLLATE utf8_bin NOT NULL,
  `minaya_number` text COLLATE utf8_bin NOT NULL,
  `last_date` varchar(11) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;";
//echo $query;
mysqli_query($link_admin,$query);



//first we load up all csv files:
foreach (glob("csv_runs/bursa/minayot/*.csv") as $filename)
{
	//echo $filename;
	$entries=0;
	$arr[] = $filename;
	$data = file_get_contents($filename);//load up csv

	$data_array = explode("\n", $data);//break file into lines
	$csv = array_map('str_getcsv', $data_array);//break up comma delimited
	$csv_len = count($csv);
	$first_line = iconv('cp1255','UTF-8', $csv[0][0]);
	$minaya_name = "";
	$minaya_number = "";
	$rest = substr($first_line, strlen('ðúåðéí äéñèåøééí - '));
	if (strpos($rest,'-') != FALSE) {
		list($minaya_name, $minaya_number) = explode(" - ", $rest);
		$minaya_name = mysqli_real_escape_string($link,$minaya_name);
	}
	else {
		$minaya_number = "";
		$minaya_name = $rest;
		// $minaya_name = 
	}
	//echo $minaya_name . " " . $minaya_number . "<br>";
	// echo $minaya_number . " " . $minaya_name;
	// die();
	//load header line
	$c=count($csv[3]);
	for ($i=0; $i<$c; $i++)
	{
		$csv_line[$i] = trim(iconv('cp1255','UTF-8', $csv[3][$i]));
	}
	//with medadim, like ta100
	//> תאריך [1] => מדד בסיס [2] => מדד פתיחה [3] => מדד נעילה [4] => מדד גבוה [5] => מדד נמוך [6] => שווי שוק כולל(אלפי ש"ח) * )
	
	$date_index_i = array_search('תאריך', $csv_line);

	//for madad files
	$madad_basis_i = array_search('מדד בסיס', $csv_line);
	$madad_open_i = array_search('מדד פתיחה', $csv_line);
	$madad_close_i = array_search('מדד נעילה', $csv_line);
	$madad_high_i = array_search('מדד גבוה', $csv_line);
	$madad_low_i = array_search('מדד נמוך', $csv_line);
	$shovi_shuk_i = array_search('שווי שוק כולל(אלפי ש"ח) * ', $csv_line);

	//for regular files
	$shaar_neila_metuam_i =  array_search('שער נעילה מתואם', $csv_line);
	$shaar_neila_i =  array_search( 'שער נעילה (באגורות)', $csv_line);

	$machzor_shekel_i =  array_search('מחזור מסחר(ש"ח)', $csv_line);
	$shovi_shuk_i =  array_search('שווי שוק (אלפי ש"ח)', $csv_line);
	
	//print_r($csv_line);
	//echo "date index: " . $date_index_i . " madad_close_i: " . $madad_close_i;
	//die();
	


	$table_created = 0;
	for ($i=4; $i<$csv_len-3; $i++)
	{
		$date_index = iconv('cp1255','UTF-8', $csv[$i][$date_index_i]);
		$date_index = substr($date_index, 0, 10);
		$date_index = date_create_from_format('d/m/Y', $date_index);
		$date_index = $date_index->format('Y-m-d');
		if ($i == 4) $latest_date = $date_index;

		$to_year = date("Y") - 1;//2015
		$from_year = $to_year -1;//2014
		$month = 12;
		$day = 31;
		$from_date = $from_year . '-' . $month . '-' . $day;
		$to_date = $to_year . '-' . $month . '-' . $day;

		$madad_name = $minaya_name . " " . $minaya_number;
		if (is_numeric($csv[$i][$madad_close_i]) && $csv[$i][$madad_close_i] > 0)//skip bad lines
		{
			if ($date_index >= $from_date && $date_index <= $to_date) {
				$madad_close = $csv[$i][$madad_close_i];
				$query = "INSERT INTO `benchmark_data` SET `date`='$date_index', `close_price`='$madad_close', `name`='$madad_name'";
				echo "<br>\n" .$query;
				// continue;
				mysqli_query($link_pma,$query) or die("problem");
				$entries++;
				echo "<br>\ninserted: name: $minaya_name $minaya_number date: $date_index close: $madad_close";
				continue;
			}
		}
		continue;


		if (is_numeric($csv[$i][$shaar_neila_metuam_i]) && $csv[$i][$shaar_neila_metuam_i] > 0)//skip bad lines
		{
			$shaar_neila_metuam = $csv[$i][$shaar_neila_metuam_i];
			$shaar_neila = $csv[$i][$shaar_neila_i];
			$shovi_shuk = $csv[$i][$shovi_shuk_i];
			$machzor_shekel = $csv[$i][$machzor_shekel_i];
		} 

		//echo $shaar_neila . " " . $shaar_neila . " " . $shaar_neila_metuam . " " . $shovi_shuk . " " . $machzor_shekel;
		//die;

		if ($table_created == 0)
		{
			//create table if not exists
			$query = "CREATE TABLE IF NOT EXISTS `$minaya_number` (
			  `id` int(11) NOT NULL AUTO_INCREMENT,
			  `date_t` varchar(11) COLLATE utf8_bin NOT NULL,
			  `close` decimal(15,5) NOT NULL,
			  `shovi_shuk` int(11) NOT NULL,
			  PRIMARY KEY (`id`),
			  UNIQUE KEY `date_t` (`date_t`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;";
			//echo $query;
			mysqli_query($link,$query);
			//$result = mysqli_query($link,"SHOW COLUMNS FROM `$minaya_number` LIKE 'adjusted_close'");
			//$exists = (mysqli_num_rows($result))?TRUE:FALSE;
			//if(!$exists) { //no adjusted close (in hebrew minaya)
		   		$query = "ALTER TABLE `$minaya_number` ADD `adjusted_close` DECIMAL(15,5) NOT NULL";
		   		mysqli_query($link,$query);
		   		$query = "ALTER TABLE `$minaya_number` ADD `bursa_adjusted_close` DECIMAL(15,5) NOT NULL";
		   		mysqli_query($link,$query);
		   		$query = "ALTER TABLE `$minaya_number` ADD `bursa_close` DECIMAL(15,5) NOT NULL";
		   		mysqli_query($link,$query);
		   		//$query = "TRUNCATE TABLE `$minaya_number";
		   		//echo $query;
		   		//mysqli_query($link,$query);
			//}
			$query = 'ALTER TABLE `$minaya_number` ADD `volume` int(13) NOT NULL';
			//echo $query;
		   	mysqli_query($link,$query);
			$table_created = 1;
		}

		//insert data into table, but skip empty entries
		$query  = "INSERT INTO `$minaya_number` SET `date_t`='$date_index'," .
		" `adjusted_close` = '$shaar_neila_metuam', `shovi_shuk`='$shovi_shuk', " . 
		"`close`='$shaar_neila', `volume`='$machzor_shekel', " . 
		" `bursa_adjusted_close` = '$shaar_neila_metuam'," . 
		" `bursa_close` = '$shaar_neila' " .
		"ON DUPLICATE KEY UPDATE `adjusted_close` = '$shaar_neila_metuam', " . 
		"`shovi_shuk`='$shovi_shuk', `close`='$shaar_neila', `volume`='$machzor_shekel'," . 
		" `bursa_adjusted_close` = '$shaar_neila_metuam'";
		//if ('2015-03-02' == $date_index) {echo $query; die;}
		//echo $query;
		//die;
		mysqli_query($link,$query);
		$entries++;
		//die;

		//insert names into another table

		//echo "$i: " . $date_index . " " . $shaar_neila . "<br>";
	}
	//$query = "INSERT INTO `hondor_admin`.`minaya_names` (`id`, `minaya_name`, `minaya_number`, `last_date`) VALUES (NULL, '$minaya_name', '$minaya_number', '$latest_date');";
	//$query ="INSERT INTO `madad_names` SET `name_metuam`='$madad_name', `real_name`='$madad_name_orig', `last_date`='$latest_date'";
	//echo $query;
	//mysqli_query($link_admin,$query);
	//die;
	//echo "\n<br>done: " . iconv('cp1255','UTF-8', $filename) . " $entries entries added ($minaya_number) ($minaya_name)";
	//@rename("./" . $filename, "./" . dirname($filename) . "/done/" . basename($filename));
}

?>