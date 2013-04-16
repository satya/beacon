<?php
/*
 * Beacon PHP Settings
 *
 */

// Choose whether new user registration is allowed
$beacon_create_user = false;

// Path to conf file
$beacon_conf_path = "../beacon/beacon.conf";

// Choose what DB engine is to be used
$beacon_db_type = "mysql";

// MySQL specific settings
$beacon_mysql_hostname = "localhost" ;    //replace with your database location
$beacon_mysql_database = "beacon" ;     //replace with your database name

$beacon_mysql_username = "beacon" ;     //replace with database username
$beacon_mysql_password = "beacon" ;     //replace with database password

// LDAP specific settings
$beacon_ldap_configuration = array(
  'account_suffix'       => '@example.com',
  'base_dn'              => 'DC=example,DC=com',
  'domain_controllers'   => array('dc1.example.com','dc2.example.com'),
  'admin_username'       => 'ldapusername',
  'admin_password'       => 'ldappassword',
  'real_primarygroup'    => FALSE, // for optimization
  //'use_ssl'              => '',
  //'use_tls'              => '',
  //'recursive_groups'     => '',
  'ad_port'              => '389',
  //'sso'                  => '',
);
