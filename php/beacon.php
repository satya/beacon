<?php
/*
 * Main Page
 */

session_start();

require_once("lib/BeaconAuthenticator.php");
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
} else {

?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
  <head>
    <title>Beacon</title>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <link rel="stylesheet" href="css/beaconfull.css" type="text/css" />

        <!-- Required by Beacon -->

        <!-- <link rel="stylesheet" href="../beacon/css/jquery.jgrowl.css" type="text/css" /> -->
        <link rel="stylesheet" href="../beacon/css/jquery.tree.css" type="text/css" />
        <!-- Will be loaded by the theme selected in conf file -->
        <link rel="stylesheet" href="../beacon/css/<?php echo $request->theme; ?>/jquery.ui.css" type="text/css" />
        <link rel="stylesheet" href="../beacon/css/beacon.css" type="text/css" />

</head>

<!-- This template shows Beacon on the full page. -->
<body>

    <!-- Leave it empty. Content will be loaded dynamically. -->
    <div id="BeaconContainer">
    </div>

    <!-- Better to load all javascript at the bottom of the page-->
    <script src="../beacon/js/jquery.js" type="text/javascript"></script>
    <script src="../beacon/js/Beacon.js" type="text/javascript"></script>

    <script type="text/javascript">
        // This is important to make the fileupload work!
        window.beacon = {};

        $(document).ready(function() {
            // Start up Beacon by showing the Container
            beacon = new Beacon("#BeaconContainer", "<?php echo $request->url . 'beacon/beacon.conf'; ?>");
        });

    </script>

</body>
</html>

<?php
}
?>
