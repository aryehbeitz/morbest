<?php
function do_connection()
{
        $link = @mysqli_connect('localhost', 'pma', 'morbest', 'pma');
        /* check connection */
        if (mysqli_connect_errno()) {
                return 0;
        }
        return $link;
}

function run_query($link, $query)
{
	$result = mysqli_query($link, $query) or trigger_error("Query Failed! SQL: $sql - Error: ".mysqli_error(), E_USER_ERROR);
	return $result;
}
function get_cookie_array($link, $cookie_id)
{
	$query = "SELECT * FROM `Cookies` WHERE `CookieString` = '$cookie_id'";
	$row = queryLine($link, $query);
	return $row;
	//returns $CookieID $CookieString $CookieDate
}
function count_results($link, $query)
{
	$result = mysqli_query($link, $query);
	$num_rows = mysqli_num_rows($result);
	return $num_rows;
}
function queryGetLastId($link, $query)
{
	mysqli_query($link, $query) or trigger_error("Query Failed! SQL: $sql - Error: ".mysqli_error(), E_USER_ERROR);
	return mysqli_insert_id($link);
}
function queryLine($link, $query)
{
	$result = run_query($link, $query);
	if ($result->num_rows > 0)
	{
    	$row = mysqli_fetch_assoc($result);
        return $row;
    }
    return 0;
}
function get_query_data($link, $query)
{
	$result = run_query($link, $query);
    if ($result->num_rows > 0) {
    	$data = Array();
        while ($row = mysqli_fetch_assoc($result)) {
        	$data[] = $row;
        }
        return $data;
    }
    return 0; //no rows
}

function floorToFraction($number, $denominator = 1)
{
    $x = $number * $denominator;
    $x = floor($x);
    $x = $x / $denominator;
    return $x;
}

$question_number = Array();
$question_number["looking-for"] = 0;
$question_number["age"] = 1;
$question_number["income_expenses"] = 2;
$question_number["liquid_funds"] = 3;
$question_number["Loss_investment"] = 4;
$question_number["Risk_level"] = 5;
$question_number["designate_invest"] = 6;
$question_number["Investment_proportion"] = 7;
$question_number["Family_income"] = 8;
$question_number["knowledge"] = 9;
$question_number["Tracking"] = 10;
$question_number["portfolios_prefer"] = 11;
$question_number["Years_retire"] = 12;
$question_number["Exceptional_income"] = 13;
$question_number["investment_consume"] = 14;
$question_number["consume_third"] = 15;
$question_number["savings"] = 16;
$question_number["pension_years"] = 17;
$question_number["allowance"] = 18;
$question_number["monthly_pension"] = 19;




//q-question-label-checked icon-ok
$chkdm["income_expenses"]["dont_know2"] = "";
$chkdm["income_expenses"]["expenses_g_income"] = "";
$chkdm["income_expenses"]["balanced"] = "";
$chkdm["income_expenses"]["income_ug_expenses"] = "";
$chkdm["income_expenses"]["income_always_g_expenses"] = "";

$chkdm["liquid_funds"]["dont_know3"] = "";
$chkdm["liquid_funds"]["bank_deposit"] = "";
$chkdm["liquid_funds"]["solid_invest"] = "";
$chkdm["liquid_funds"]["combine_invest"] = "";
$chkdm["liquid_funds"]["high_risk"] = "";

$chkdm["Loss_investment"]["dont_know4"] = "";
$chkdm["Loss_investment"]["sell_immediately"] = "";
$chkdm["Loss_investment"]["Wait_priciple"] = "";
$chkdm["Loss_investment"]["Im_Calm"] = "";
$chkdm["Loss_investment"]["Increase_investmenet"] = "";

$chkdm["Risk_level"]["dont_know5"] = "";
$chkdm["Risk_level"]["Very_low"] = "";
$chkdm["Risk_level"]["Low"] = "";
$chkdm["Risk_level"]["Low_medium"] = "";
$chkdm["Risk_level"]["Medium"] = "";
$chkdm["Risk_level"]["Medium_high"] = "";
$chkdm["Risk_level"]["High"] = "";

$chkdm["designate_invest"]["dont_know6"] = "";
$chkdm["designate_invest"]["Money_value"] = "";
$chkdm["designate_invest"]["excessive_yield"] = "";
$chkdm["designate_invest"]["market_yield"] = "";
$chkdm["designate_invest"]["higher_yield"] = "";

$chkdm["Investment_proportion"]["dont_know7"] = "";
$chkdm["Investment_proportion"]["100%_assets"] = "";
$chkdm["Investment_proportion"]["75%_100%_assets"] = "";
$chkdm["Investment_proportion"]["50%-75%_assets"] = "";
$chkdm["Investment_proportion"]["25%_50%_assets"] = "";
$chkdm["Investment_proportion"]["0%_25%_assets"] = "";

$chkdm["Family_income"]["dont_know8"] = "";
$chkdm["Family_income"]["Below_average"] = "";
$chkdm["Family_income"]["Average"] = "";
$chkdm["Family_income"]["Above_Average"] = "";
$chkdm["Family_income"]["Well_above_average"] = "";

$chkdm["knowledge"]["dont_know9"] = "";
$chkdm["knowledge"]["Dont_understand"] = "";
$chkdm["knowledge"]["Understand_little"] = "";
$chkdm["knowledge"]["Understand"] = "";
$chkdm["knowledge"]["Understand_Well"] = "";

$chkdm["Tracking"]["dont_know10"] = "";
$chkdm["Tracking"]["Dont_follow"] = "";
$chkdm["Tracking"]["Quarterly"] = "";
$chkdm["Tracking"]["Monthly"] = "";
$chkdm["Tracking"]["Weekly"] = "";
$chkdm["Tracking"]["Daily"] = "";

$chkdm["portfolios_prefer"]["dont_know11"] = "";
$chkdm["portfolios_prefer"]["yield2%"] = "";
$chkdm["portfolios_prefer"]["y7%-l1%"] = "";
$chkdm["portfolios_prefer"]["y12%-l3%"] = "";
$chkdm["portfolios_prefer"]["y20%-l8"] = "";

$chkdm["Years_retire"]["dont_know12"] = "";
$chkdm["Years_retire"]["0_5_years"] = "";
$chkdm["Years_retire"]["5_10_years"] = "";
$chkdm["Years_retire"]["10_15_years"] = "";
$chkdm["Years_retire"]["15_20_years"] = "";
$chkdm["Years_retire"]["Over_20_years"] = "";

$chkdm["Exceptional_income"]["dont_know13"] = "";
$chkdm["Exceptional_income"]["Ex_Ex"] = "";
$chkdm["Exceptional_income"]["Ex_In_Ex"] = "";
$chkdm["Exceptional_income"]["ExIncomeLP"] = "";
$chkdm["Exceptional_income"]["ExIncome"] = "";

$chkdm["investment_consume"]["dont_know14"] = "";
$chkdm["investment_consume"]["Year"] = "";
$chkdm["investment_consume"]["Between_2to5"] = "";
$chkdm["investment_consume"]["Between_5to10"] = "";
$chkdm["investment_consume"]["Over10"] = "";

$chkdm["consume_third"]["dont_know15"] = "";
$chkdm["consume_third"]["100%"] = "";
$chkdm["consume_third"]["50%"] = "";
$chkdm["consume_third"]["25%"] = "";
$chkdm["consume_third"]["iwont"] = "";

$chkdm["savings"]["dont_know16"] = "";
$chkdm["savings"]["0_100"] = "";
$chkdm["savings"]["100_500"] = "";
$chkdm["savings"]["500_1000"] = "";
$chkdm["savings"]["over1000"] = "";

$chkdm["pension_years"]["dont_know17"] = "";
$chkdm["pension_years"]["0_5_Years"] = "";
$chkdm["pension_years"]["5_12"] = "";
$chkdm["pension_years"]["12_25_Years"] = "";
$chkdm["pension_years"]["over_25_Years"] = "";

$chkdm["allowance"]["dont_know18"] = "";
$chkdm["allowance"]["Between_0_1"] = "";
$chkdm["allowance"]["Between_1_5"] = "";
$chkdm["allowance"]["Between_5_10"] = "";
$chkdm["allowance"]["Above_10"] = "";

$chkdm["monthly_pension"]["dont_know19"] = "";
$chkdm["monthly_pension"]["Between_0_1"] = "";
$chkdm["monthly_pension"]["Between_1_5"] = "";
$chkdm["monthly_pension"]["Between_5_10"] = "";
$chkdm["monthly_pension"]["Above_10"] = "";


//checked
$chkd["income_expenses"]["dont_know2"] = "";
$chkd["income_expenses"]["expenses_g_income"] = "";
$chkd["income_expenses"]["balanced"] = "";
$chkd["income_expenses"]["income_ug_expenses"] = "";
$chkd["income_expenses"]["income_always_g_expenses"] = "";

$chkd["liquid_funds"]["dont_know3"] = "";
$chkd["liquid_funds"]["bank_deposit"] = "";
$chkd["liquid_funds"]["solid_invest"] = "";
$chkd["liquid_funds"]["combine_invest"] = "";
$chkd["liquid_funds"]["high_risk"] = "";

$chkd["Loss_investment"]["dont_know4"] = "";
$chkd["Loss_investment"]["sell_immediately"] = "";
$chkd["Loss_investment"]["Wait_priciple"] = "";
$chkd["Loss_investment"]["Im_Calm"] = "";
$chkd["Loss_investment"]["Increase_investmenet"] = "";

$chkd["Risk_level"]["dont_know5"] = "";
$chkd["Risk_level"]["Very_low"] = "";
$chkd["Risk_level"]["Low"] = "";
$chkd["Risk_level"]["Low_medium"] = "";
$chkd["Risk_level"]["Medium"] = "";
$chkd["Risk_level"]["Medium_high"] = "";
$chkd["Risk_level"]["High"] = "";

$chkd["designate_invest"]["dont_know6"] = "";
$chkd["designate_invest"]["Money_value"] = "";
$chkd["designate_invest"]["excessive_yield"] = "";
$chkd["designate_invest"]["market_yield"] = "";
$chkd["designate_invest"]["higher_yield"] = "";

$chkd["Investment_proportion"]["dont_know7"] = "";
$chkd["Investment_proportion"]["100%_assets"] = "";
$chkd["Investment_proportion"]["75%_100%_assets"] = "";
$chkd["Investment_proportion"]["50%-75%_assets"] = "";
$chkd["Investment_proportion"]["25%_50%_assets"] = "";
$chkd["Investment_proportion"]["0%_25%_assets"] = "";

$chkd["Family_income"]["dont_know8"] = "";
$chkd["Family_income"]["Below_average"] = "";
$chkd["Family_income"]["Average"] = "";
$chkd["Family_income"]["Above_Average"] = "";
$chkd["Family_income"]["Well_above_average"] = "";

$chkd["knowledge"]["dont_know9"] = "";
$chkd["knowledge"]["Dont_understand"] = "";
$chkd["knowledge"]["Understand_little"] = "";
$chkd["knowledge"]["Understand"] = "";
$chkd["knowledge"]["Understand_Well"] = "";

$chkd["Tracking"]["dont_know10"] = "";
$chkd["Tracking"]["Dont_follow"] = "";
$chkd["Tracking"]["Quarterly"] = "";
$chkd["Tracking"]["Monthly"] = "";
$chkd["Tracking"]["Weekly"] = "";
$chkd["Tracking"]["Daily"] = "";

$chkd["portfolios_prefer"]["dont_know11"] = "";
$chkd["portfolios_prefer"]["yield2%"] = "";
$chkd["portfolios_prefer"]["y7%-l1%"] = "";
$chkd["portfolios_prefer"]["y12%-l3%"] = "";
$chkd["portfolios_prefer"]["y20%-l8"] = "";

$chkd["Years_retire"]["dont_know12"] = "";
$chkd["Years_retire"]["0_5_years"] = "";
$chkd["Years_retire"]["5_10_years"] = "";
$chkd["Years_retire"]["10_15_years"] = "";
$chkd["Years_retire"]["15_20_years"] = "";
$chkd["Years_retire"]["Over_20_years"] = "";

$chkd["Exceptional_income"]["dont_know13"] = "";
$chkd["Exceptional_income"]["Ex_Ex"] = "";
$chkd["Exceptional_income"]["Ex_In_Ex"] = "";
$chkd["Exceptional_income"]["ExIncomeLP"] = "";
$chkd["Exceptional_income"]["ExIncome"] = "";

$chkd["investment_consume"]["dont_know14"] = "";
$chkd["investment_consume"]["Year"] = "";
$chkd["investment_consume"]["Between_2to5"] = "";
$chkd["investment_consume"]["Between_5to10"] = "";
$chkd["investment_consume"]["Over10"] = "";

$chkd["consume_third"]["dont_know15"] = "";
$chkd["consume_third"]["100%"] = "";
$chkd["consume_third"]["50%"] = "";
$chkd["consume_third"]["25%"] = "";
$chkd["consume_third"]["iwont"] = "";

$chkd["savings"]["dont_know16"] = "";
$chkd["savings"]["0_100"] = "";
$chkd["savings"]["100_500"] = "";
$chkd["savings"]["500_1000"] = "";
$chkd["savings"]["over1000"] = "";

$chkd["pension_years"]["dont_know17"] = "";
$chkd["pension_years"]["0_5_Years"] = "";
$chkd["pension_years"]["5_12"] = "";
$chkd["pension_years"]["12_25_Years"] = "";
$chkd["pension_years"]["over_25_Years"] = "";

$chkd["allowance"]["dont_know18"] = "";
$chkd["allowance"]["Between_0_1"] = "";
$chkd["allowance"]["Between_1_5"] = "";
$chkd["allowance"]["Between_5_10"] = "";
$chkd["allowance"]["Above_10"] = "";

$chkd["monthly_pension"]["dont_know19"] = "";
$chkd["monthly_pension"]["Between_0_1"] = "";
$chkd["monthly_pension"]["Between_1_5"] = "";
$chkd["monthly_pension"]["Between_5_10"] = "";
$chkd["monthly_pension"]["Above_10"] = "";








$data_var["age"]["max_weight"] = 1.50;
$data_var["age"]["min_weight"] = -1.00;


$data_var["income_expenses"]["dont_know2"] = 0.50;
$data_var["income_expenses"]["expenses_g_income"] = 0.25;
$data_var["income_expenses"]["balanced"] = 0.50;
$data_var["income_expenses"]["income_ug_expenses"] = 0.75;
$data_var["income_expenses"]["income_always_g_expenses"] = 1.00;
$data_var["income_expenses"]["max_weight"] = 1.00;
$data_var["income_expenses"]["min_weight"] = 0.25;

$data_var["liquid_funds"]["dont_know3"] = 0.50;
$data_var["liquid_funds"]["bank_deposit"] = 0.25;
$data_var["liquid_funds"]["solid_invest"] = 0.50;
$data_var["liquid_funds"]["combine_invest"] = 0.75;
$data_var["liquid_funds"]["high_risk"] = 1.00;
$data_var["liquid_funds"]["max_weight"] = 1.00;
$data_var["liquid_funds"]["min_weight"] = 0.25;

$data_var["Loss_investment"]["dont_know4"] = 0.50;
$data_var["Loss_investment"]["sell_immediately"] = 0.25;
$data_var["Loss_investment"]["Wait_priciple"] = 0.50;
$data_var["Loss_investment"]["Im_Calm"] = 0.75;
$data_var["Loss_investment"]["Increase_investmenet"] = 1.00;
$data_var["Loss_investment"]["max_weight"] = 1.00;
$data_var["Loss_investment"]["min_weight"] = 0.25;

$data_var["Risk_level"]["dont_know5"] = 0.50;
$data_var["Risk_level"]["Very_low"] = -0.50;
$data_var["Risk_level"]["Low"] = 0.00;
$data_var["Risk_level"]["Low_medium"] = 0.25;
$data_var["Risk_level"]["Medium"] = 0.50;
$data_var["Risk_level"]["Medium_high"] = 1.00;
$data_var["Risk_level"]["High"] = 2.00;
$data_var["Risk_level"]["max_weight"] = 2.00;
$data_var["Risk_level"]["min_weight"] = -0.5;

$data_var["designate_invest"]["dont_know6"] = 0.50;
$data_var["designate_invest"]["Money_value"] = 0.25;
$data_var["designate_invest"]["excessive_yield"] = 0.50;
$data_var["designate_invest"]["market_yield"] = 0.75;
$data_var["designate_invest"]["higher_yield"] = 1.00;
$data_var["designate_invest"]["max_weight"] = 1.00;
$data_var["designate_invest"]["min_weight"] = 0.25;

$data_var["Investment_proportion"]["dont_know7"] = 0.50;
$data_var["Investment_proportion"]["100%_assets"] = 0.25;
$data_var["Investment_proportion"]["75%_100%_assets"] = 0.50;
$data_var["Investment_proportion"]["50%-75%_assets"] = 0.75;
$data_var["Investment_proportion"]["25%_50%_assets"] = 1.00;
$data_var["Investment_proportion"]["0%_25%_assets"] = 1.25;
$data_var["Investment_proportion"]["max_weight"] = 1.25;
$data_var["Investment_proportion"]["min_weight"] = 0.25;

$data_var["Family_income"]["dont_know8"] = 0.50;
$data_var["Family_income"]["Below_average"] = 0.25;
$data_var["Family_income"]["Average"] = 0.50;
$data_var["Family_income"]["Above_Average"] = 0.75;
$data_var["Family_income"]["Well_above_average"] = 1.00;
$data_var["Family_income"]["max_weight"] = 1.00;
$data_var["Family_income"]["min_weight"] = 0.25;

$data_var["knowledge"]["dont_know9"] = 0.50;
$data_var["knowledge"]["Dont_understand"] = 0.25;
$data_var["knowledge"]["Understand_little"] = 0.50;
$data_var["knowledge"]["Understand"] = 0.75;
$data_var["knowledge"]["Understand_Well"] = 1.00;
$data_var["knowledge"]["max_weight"] = 1.00;
$data_var["knowledge"]["min_weight"] = 0.25;

$data_var["Tracking"]["dont_know10"] = 0.50;
$data_var["Tracking"]["Dont_follow"] = 0.25;
$data_var["Tracking"]["Quarterly"] = 0.50;
$data_var["Tracking"]["Monthly"] = 0.75;
$data_var["Tracking"]["Weekly"] = 1.00;
$data_var["Tracking"]["Daily"] = 1.25;
$data_var["Tracking"]["max_weight"] = 1.25;
$data_var["Tracking"]["min_weight"] = 0.25;

$data_var["portfolios_prefer"]["dont_know11"] = 0.50;
$data_var["portfolios_prefer"]["yield2%"] = 0.25;
$data_var["portfolios_prefer"]["y7%-l1%"] = 0.50;
$data_var["portfolios_prefer"]["y12%-l3%"] = 0.75;
$data_var["portfolios_prefer"]["y20%-l8"] = 1.00;
$data_var["portfolios_prefer"]["max_weight"] = 1.00;
$data_var["portfolios_prefer"]["min_weight"] = 0.25;

$data_var["Years_retire"]["dont_know12"] = 0.50;
$data_var["Years_retire"]["0_5_years"] = -0.25;
$data_var["Years_retire"]["5_10_years"] = 0.25;
$data_var["Years_retire"]["10_15_years"] = 0.50;
$data_var["Years_retire"]["15_20_years"] = 0.75;
$data_var["Years_retire"]["Over_20_years"] = 1.25;
$data_var["Years_retire"]["max_weight"] = 1.25;
$data_var["Years_retire"]["min_weight"] = -0.25;

$data_var["Exceptional_income"]["dont_know13"] = 0.50;
$data_var["Exceptional_income"]["Ex_Ex"] = 0.25;
$data_var["Exceptional_income"]["Ex_In_Ex"] = 0.50;
$data_var["Exceptional_income"]["ExIncomeLP"] = 0.75;
$data_var["Exceptional_income"]["ExIncome"] = 1.00;
$data_var["Exceptional_income"]["max_weight"] = 1.00;
$data_var["Exceptional_income"]["min_weight"] = 0.25;

$data_var["investment_consume"]["dont_know14"] = 0.50;
$data_var["investment_consume"]["Year"] = 0.25;
$data_var["investment_consume"]["Between_2to5"] = 0.50;
$data_var["investment_consume"]["Between_5to10"] = 0.75;
$data_var["investment_consume"]["Over10"] = 1.00;
$data_var["investment_consume"]["max_weight"] = 1.00;
$data_var["investment_consume"]["min_weight"] = 0.25;

$data_var["consume_third"]["dont_know15"] = 0.50;
$data_var["consume_third"]["100%"] = 0.25;
$data_var["consume_third"]["50%"] = 0.50;
$data_var["consume_third"]["25%"] = 0.75;
$data_var["consume_third"]["iwont"] = 1.00;
$data_var["consume_third"]["max_weight"] = 1.00;
$data_var["consume_third"]["min_weight"] = 0.25;

$data_var["savings"]["dont_know16"] = 0.50;
$data_var["savings"]["0_100"] = 0.25;
$data_var["savings"]["100_500"] = 0.50;
$data_var["savings"]["500_1000"] = 0.75;
$data_var["savings"]["over1000"] = 1.00;
$data_var["savings"]["max_weight"] = 1.00;
$data_var["savings"]["min_weight"] = 0.25;

$data_var["pension_years"]["dont_know17"] = 0.50;
$data_var["pension_years"]["0_5_Years"] = 0.25;
$data_var["pension_years"]["5_12"] = 0.50;
$data_var["pension_years"]["12_25_Years"] = 0.75;
$data_var["pension_years"]["over_25_Years"] = 1.00;
$data_var["pension_years"]["max_weight"] = 1.00;
$data_var["pension_years"]["min_weight"] = 0.25;

$data_var["allowance"]["dont_know18"] = 0.50;
$data_var["allowance"]["Between_0_1"] = 0.25;
$data_var["allowance"]["Between_1_5"] = 0.50;
$data_var["allowance"]["Between_5_10"] = 0.75;
$data_var["allowance"]["Above_10"] = 1.00;
$data_var["allowance"]["max_weight"] = 1.00;
$data_var["allowance"]["min_weight"] = 0.25;

$data_var["monthly_pension"]["dont_know19"] = 0.50;
$data_var["monthly_pension"]["Between_0_1"] = 0.25;
$data_var["monthly_pension"]["Between_1_5"] = 0.50;
$data_var["monthly_pension"]["Between_5_10"] = 0.75;
$data_var["monthly_pension"]["Above_10"] = 1.00;
$data_var["monthly_pension"]["max_weight"] = 1.00;
$data_var["monthly_pension"]["min_weight"] = 0.25;

//calculate max weight
$max_weight = 0;
$min_weight = 0;
foreach($data_var as $item)
{
	$max_weight += $item["max_weight"];
	$min_weight += $item["min_weight"];
}
//$sum_max_weight=21.25  // ניקוד מכסימלי
//$sum_min_weight=2.25  // ניקוד מינימלי

// sum(values) = // יש לחשב את סהכ התשובות שנבחרו
// Floor(Risk_Rank = sum(values)/sum(max_weight)*10,0.25)
//Max(Risk_Rank) =10
//Min(Risk_Rank) =1

?>