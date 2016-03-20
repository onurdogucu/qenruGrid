<?php


$dataArray = array(
	
	"GetRowDataSource" =>array(
		0 => array(
			"DataID"			=> "10",
			"Arrival" 			=> "02.03.2016",
			"FromCountry"		=> "TURKEY",
			"Pol"				=> "MERSIN",
			"ToCountry"			=> "GERMANY",
			"Pod"				=> "Hamburg",
			"Line"				=> "Hamburg Sud",
			"ReferenceNo"		=> "Vestas - Origin",
			"Departure"			=> "01.02.2016",
			"TransitTime"		=> "31",
			"Countdown"			=>	"Arrived"
			),
		1 => array(
			"DataID"			=> "11",
			"Arrival" 			=> "12.03.2016",
			"FromCountry"		=> "TURKEY",
			"Pol"				=> "IZMIR",
			"ToCountry"			=> "CHINA",
			"Pod"				=> "TIANJIN",
			"Line"				=> "MAERSK",
			"ReferenceNo"		=> "955623344",
			"Departure"			=> "22.02.2016",
			"TransitTime"		=> "20",
			"Countdown"			=>	"Arrived"
			),
		2 => array(
			"DataID"			=> "12",
			"Arrival" 			=> "29.01.2016",
			"FromCountry"		=> "SAUDI ARABIA",
			"Pol"				=> "JUBAIL",
			"ToCountry"			=> "EGYPT",
			"Pod"				=> "ALEXANDRIA",
			"Line"				=> "MAERSK",
			"ReferenceNo"		=> "TSN8401251",
			"Departure"			=> "12.02.2016",
			"TransitTime"		=> "14",
			"Countdown"			=>	"Arrived"
			),
		3 => array(
			"DataID"			=> "13",
			"Arrival" 			=> "08.03.2016",
			"FromCountry"		=> "TURKEY",
			"Pol"				=> "MERSIN",
			"ToCountry"			=> "EGYPT",
			"Pod"				=> "AARHUS",
			"Line"				=> "SEAGO LINE",
			"ReferenceNo"		=> "5 x 40OTHC Kangal to Laem",
			"Departure"			=> "18.03.2016",
			"TransitTime"		=> "10",
			"Countdown"			=>	"02 days left"
			),
		4 => array(
			"DataID"			=> "14",
			"Arrival" 			=> "20.01.2016",
			"FromCountry"		=> "TURKEY",
			"Pol"				=> "ALIAGA ( IZMIR )",
			"ToCountry"			=> "EGYPT",
			"Pod"				=> "GIJON",
			"Line"				=> "MSC",
			"ReferenceNo"		=> "VESTAS",
			"Departure"			=> "22.02.2016",
			"TransitTime"		=> "32",
			"Countdown"			=>	"Arrived"
			),
		5 => array(
			"DataID"			=> "15",
			"Arrival" 			=> "10.12.2015",
			"FromCountry"		=> "SAUDI ARABIA",
			"Pol"				=> "TIANJIN",
			"ToCountry"			=> "TURKEY",
			"Pod"				=> "MERSIN",
			"Line"				=> "MAERSK",
			"ReferenceNo"		=> "955623344",
			"Departure"			=> "10.01.2016",
			"TransitTime"		=> "31",
			"Countdown"			=>	"Arrived"
			),
		6 => array(
			"DataID"			=> "16",
			"Arrival" 			=> "15.12.2015",
			"FromCountry"		=> "SAUDI ARABIA",
			"Pol"				=> "BILLAGA",
			"ToCountry"			=> "TURKEY",
			"Pod"				=> "MERSIN",
			"Line"				=> "UPL",
			"ReferenceNo"		=> "1234523344",
			"Departure"			=> "19.01.2016",
			"TransitTime"		=> "31",
			"Countdown"			=>	"05 days left"
			),

		)
	);

echo json_encode($dataArray);