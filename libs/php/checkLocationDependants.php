<?php

	// example use from browser
	// use insertDepartment.php first to create new dummy record and then specify it's id in the command below
	// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id= <id>

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

    $ifQuery = 'SELECT * FROM department WHERE locationID = ' . $_POST['id'];

	$result = $conn->query($ifQuery);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

    $data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

    if (count($data) > 0) {
        $output['status']['code'] = "409";
        $output['status']['name'] = "Dependants";
        $output['status']['description'] = "Can't be Deleted";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = $data;
        
        mysqli_close($conn);
    
        echo json_encode($output); 

        exit;

    } else {

		$getQuery = 'Select name FROM location WHERE id = ' . $_POST['id'];
        $id = $_POST['id'];

		$result = $conn->query($getQuery);

		if (!$result) {

			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query failed";	
			$output['data'] = [];
	
			mysqli_close($conn);
	
			echo json_encode($output); 
	
			exit;
	
		}
	
		$data = [];
	
		while ($row = mysqli_fetch_assoc($result)) {
	
			array_push($data, $row);
	
		}	

        $output['status']['code'] = "404";
        $output['status']['name'] = "Delete";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = $data[0]['name'];
        $output['id'] = $id;
        $output['custom'] = 'Free to Delete';
        mysqli_close($conn);

        echo json_encode($output); 

        exit;
    }

?>