<?php

if($_GET["dataID"])
{
	$id = $_GET['dataID'];

	echo "Edit page of ".$id;
	echo "<br /><a href='/plugin/qenruGrid/'>Go Back</a>";
}
else
{
	echo "No data available";
}