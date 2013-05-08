<?php
/*
 * Main Page
 */

session_start();

ini_set("display_errors", 0);

require_once("lib/BeaconAPI.php");
require_once("lib/BeaconAuthenticator.php");
require_once("lib/BeaconXSLTransformer.php");
require_once("lib/BeaconMySQL.php");
require_once ('settings.php');

$beacon_db_instance = NULL;

$beacon_runnable = false;

if ($beacon_db_type == "mysql") {
    $beacon_db_instance = new BeaconMySQL();
}

$beacon_runnable = $beacon_db_instance->init_db($beacon_mysql_hostname,
                                                $beacon_mysql_database,
                                                $beacon_mysql_username,
                                                $beacon_mysql_password);

if ($beacon_runnable < 0) {
    header('Location: index.php');
    exit();
}

$auth = new BeaconAuth($beacon_db_instance);

if (!$auth->check_session()) {
    @session_destroy();
    header('Location: index.php');

    exit();
}

// Set the conf file path here
$confFile = $beacon_conf_path;

// Set the full path here
$fullPath = getcwd() . "/../";

// Pick up any requests
$request = "";
$request = json_decode(file_get_contents("php://input"));

// Create a new Beacon object
$beacon = new BeaconAPI($confFile, $fullPath, $request, $beacon_db_instance);

if ($request == '') {
    $result = $beacon->view();
    echo $result;
} else {
    // All beacon requests if made to this file should be handled.
    // You can do your own stuff when actions are called.
    switch($request->action) {
        case "beaconui":
             $ui = $beacon->fetchui();
             echo $ui;
             break;

        case "newdoc":
            $newdoc = $beacon->newdoc();
            echo $newdoc;
            break;

        case "fetchdoc":
            $fetchdoc = $beacon->fetchdoc();
            echo $fetchdoc;
            break;

        case "savedoc":
            $result = $beacon->savedoc();
            echo $result;
            break;

        case "getsrc":
            $src = $beacon->getsrc();
            echo $src;
            break;

        case "gethtml":
            $html = $beacon->gethtml();
            echo $html;
            break;

        case "getrevisions":
            $revisions = $beacon->getrevisions();
            echo $revisions;
            break;

        case "getdoclist":
            $doclist = $beacon->getdoclist();
            echo $doclist;
            break;

        case "editdoc":
            $doc = $beacon->editdoc();
            echo $doc;
            break;

        case "deletedoc":
            $deletedoc = $beacon->deletedoc();
            echo $deletedoc;
            break;

        case "customCommand":
            $callback = $beacon->customCommand();
            echo $callback;
            break;

        default:
            echo '<h3>You are not authorized to view this page.';
            exit();
    }
}
?>
