<?php
/*
 * Beacon Standlone Version
 *
 */

//ini_set("display_errors", 0);

// Clean it up
session_start();
session_destroy();

require_once ('settings.php');
require_once ('lib/BeaconMySQL.php');

$beacon_db_instance = NULL;

$beacon_runnable = false;
$beacon_install = false;
$beacon_error = "";

if ($beacon_db_type == "mysql") {
    $beacon_db_instance = new BeaconMySQL();
}

switch ($beacon_db_instance->init_db($beacon_mysql_hostname,
                                     $beacon_mysql_database,
                                     $beacon_mysql_username,
                                     $beacon_mysql_password))
{
    case -1:
        $beacon_error = " Error: Could not connect to DB. Check your settings";
        break;

    case -2:
        $beacon_error = "Error: Please check the database name in your settings.";
        break;

    case -3:
        $beacon_error = "Error: Tables are not installed. Click install to setup.";
        $beacon_install = true;
        break;

    case 1:
        $beacon_error = "Database is setup. OK.";
        $beacon_runnable = true;
        break;
}

?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>Beacon</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" href="css/main.css" type="text/css" />
    <!-- Jquery theming -->
    <link rel="stylesheet" href="../beacon/css/<?php echo $request->theme; ?>/jquery.ui.css" type="text/css" />
</head>

<body>
    <div id="container" class="ui-corner-all">
    <div class="BeaconContent">
        <div style="margin: 10px;">
            <div id="BeaconWelcome" style="float:left; width:70%;">
                <div style="text-align: center;">
                <img src="../beacon/img/beacon-logo.jpg" alt="Beacon Logo" />
                    <p>Welcome to Beacon 0.5 Beta. A WYSIWYG (and much more!) Editor.</p>
                <?php
                    if (!$beacon_runnable) {
                        echo '<p><span class="ui-state-error">'.$beacon_error.'</span></p>';
                    }
                ?>
                <noscript>
                    <p><span class="ui-state-error">Error: Javascript seems to be disabled!</span></p>
                </noscript>
                </div>
                <div style="padding-top:20px; padding-left:50px;">
                    <p>                     
                    Beacon is aimed at being a generic XML editor. Any XML format that has an ultimate output format
                    like PDF<br/> or HTML is a good candidate for a beacon-editable document. Beacon allows the user to edit
                    the output of that<br/> XML document and will automatically generate the input corresponding to the output the user sees.<br/></br/>
                    
                    <b>Contact:</b> <br/><br/>
                    Project Home: <a href="http://beaconeditor.org/">http://beaconeditor.org</a><br/>
                    Code: <a href="http://github.com/satya/beacon/">http://github.com/satya/beacon/</a><br/>
                    Wiki: <a href="http://github.com/satya/beacon/wiki">http://github.com/satya/beacon/wiki</a><br/>
                    Bugs: <a href="http://github.com/satya/beacon/issues">http://github.com/satya/beacon/issues</a><br/>
                    IRC:  #beacon on irc.freenode.net<br/>
                    Email: beacon-dev@beaconeditor.org<br/>
                    </p>
                </div>
            </div>

         
         <div style="float:right; width:20%; padding-right:20px; padding-top:50px; padding-bottom:50px;">
              <div id="loginDialog" title="Login">
                  <div class = "ui-widget-header ui-corner-all" style="text-align: center;"> <p>Sign In </p></div>
                  <form id="loginForm" action="login.php" method="POST">
                      <fieldset>
                          <label for="name">Username</label>
                          <input type="text" name="name" id="name" class="text ui-widget-content ui-corner-all" />
                          <label for="password">Password</label>
                          <input type="password" name="password" id="password" value="" class="text ui-widget-content ui-corner-all" />
                          <input type="submit" id="submit" value="Login" class="ui-button ui-state-default ui-corner-all"/>
                      </fieldset>
                  </form>
              </div>
              <div> <p> <br/></p> </div>
              <div id="createUserDialog" title="Create new user">
                  <div class = "ui-widget-header ui-corner-all" style="text-align: center;"> <p>Create New Account</p></div>
                  <form id="registerForm" action="register.php" method="POST">
                     <fieldset>
                          <label for="name">Username</label>
                          <input type="text" name="name" id="name" class="text ui-widget-content ui-corner-all" />
                          <label for="email">Email</label>
                          <input type="text" name="email" id="email" value="" class="text ui-widget-content ui-corner-all" />
                          <label for="password">Password</label>
                          <input type="password" name="password" id="password" value="" class="text ui-widget-content ui-corner-all" />
                          <input type="submit" id="submit" value="Register" class="ui-button ui-state-default ui-corner-all"/>
                      </fieldset>
                  </form>
              </div>
            <div class="actions">
                <div id="installDialog" title="Details for New Account">
                    <p id="validateTips3">All form fields are required. At least one account is required for Beacon to run.</p>
                    <form id="installForm" action="install.php" method="POST">
                        <fieldset>
                            <label for="name2">Username</label>
                            <input type="text" name="name2" id="name2" class="text ui-widget-content ui-corner-all" />
                            <label for="email2">Email</label>
                            <input type="text" name="email2" id="email2" value="" class="text ui-widget-content ui-corner-all" />
                            <label for="password2">Password</label>
                            <input type="password" name="password2" id="password2" value="" class="text ui-widget-content ui-corner-all" />
                        </fieldset>
                    </form>
                </div>
            <?php
                if ($beacon_install) {
                    echo '<p><button id="install" class="ui-button ui-state-default ui-corner-all">Install</button></p>';
                }
            ?>
        </div>
    </div>
    <script src="../beacon/js/jquery.js" type="text/javascript"></script>
    <script src="../beacon/js/jquery.ui.js" type="text/javascript"></script>
    <script src="js/main.js" type="text/javascript"></script>
</body>
</html>
</html>
