<?php
    //include("config.php");

    /*if (isset($_POST['name'])) {
        $name = strip_tags($_POST['firstName']);
        $email = strip_tags($_POST['contactEmail']);
        $sug = strip_tags($_POST['contactDepartment']);

        $output['name'] = $name;
        $output['email'] = $email;

        json_encode($output);

    }*/

    echo $_POST['firstName'];
    print_r($_POST);

    //json_encode($_REQUEST['fullName']);
?>