<?php
//http://institut-de-genomique.github.io/Ultimate-DataTable/


function do_connection()
{
        include_once("local_settings/mysettings.php");
        //$link = mysqli_connect('localhost', 'root', 'SjKRpeBQho2j', 'hondar');//laptop connection
        //$link_h = mysqli_connect('localhost', 'root', 'SjKRpeBQho2j', 'hebrew_list');//laptop connection

        //$link = mysqli_connect('localhost', 'root', '', 'hondor_admin');//laptop connection
        //$link_list = mysqli_connect('localhost', 'root', '', 'stocks_list');//laptop connection        
        // $link_pma = mysqli_connect('localhost', 'root', '', 'pma');//laptop connection        
        // $link_pma = mysqli_connect('localhost', 'php_user', 'K4dWef5oEuNH5RW', 'pma');//laptop connection        
        $link_pma = mysqli_connect('localhost', $username, $password, 'pma');//laptop connection        
        /* check connection */
        if (mysqli_connect_errno()) {
                return 0;
                //printf("Connect failed: %s\n", mysqli_connect_error());
                //exit();
        }
        return $link_pma;
        // return array($link, $link_list, $link_pma);
}

function run_query($link, $query)
{
	return @mysqli_query($link, $query);// or trigger_error("Query Failed! SQL: $query - Error: ".mysqli_error(), E_USER_ERROR);
	// return $result;
}
function query_line($link, $query)
{
	$result = run_query($link, $query);
	if ($result->num_rows > 0)
	{
    	$row = mysqli_fetch_assoc($result);
        mysqli_free_result($result);
        return $row;
    }
    return 0;
}
// when running, check for 0 for no data, else its an json
function get_query_json($link, $query) {
    $result = run_query($link, $query);
    $data = Array();
    if ($result->num_rows > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
        mysqli_free_result($result);
    }
    return json_encode($data,true);
    // return Array(); //no rows
}
//when running, check for 0 for no data, else its an array
function get_query_data($link, $query)
{
    //echo $query;
	$result = run_query($link, $query);
    if ($result && $result->num_rows > 0) {
    	$data = Array();
        while ($row = mysqli_fetch_assoc($result)) {
        	$data[] = $row;
        }
        return $data;
    }
    return 0; //no rows
}
function get_col_headers($link, $query) {
    $the_fields = Array();
    $result = run_query($link, $query);
    if ($result && $result->num_rows > 0) {
        $row = mysqli_fetch_assoc($result);
        for ($i=0; $i<count($row); $i++) {
            $fields = mysqli_fetch_field_direct($result, $i);
            $name = $fields->name;
            $the_fields[] = $name;
        }
        mysqli_free_result($result);
    }
    return $the_fields;
}
function get_run_settings($link) {
    $query = "SELECT `min_range`, `max_range`, `num_days`, `days_back`, " . 
                    "`alut_iska_us`, `alut_iska_il`, `space_two_bests`, `sort_by_field`, `space_buy_sell` " .
                    "FROM `settings` WHERE `id`=1";
    //echo $query;
    $result = mysqli_query($link, $query);
    $row = mysqli_fetch_assoc($result);
    mysqli_free_result($result);
    return $row;
}
?>