<?php
/*
 * Beacon PHP Settings
 *
 */

// Choose whether new user registration is allowed
$beacon_create_user = false;

// Path to conf file
$beacon_conf_path = "../beacon/beacon.conf";

// read in the conf file to provide the rest of the settings
$request = json_decode(file_get_contents($beacon_conf_path));

// Choose what DB engine is to be used
$beacon_db_type = $request->php->dbtype;

// MySQL specific settings
$beacon_mysql_hostname = $request->php->mysql->hostname;
$beacon_mysql_database = $request->php->mysql->database;

$beacon_mysql_username = $request->php->mysql->username;
$beacon_mysql_password = $request->php->mysql->password;

// LDAP specific settings
$beacon_ldap_configuration = array(
  'account_suffix'       => $request->php->ldap->account_suffix,
  'base_dn'              => $request->php->ldap->base_dn,
  'domain_controllers'   => $request->php->ldap->domain_controllers,
  'admin_username'       => $request->php->ldap->admin_username,
  'admin_password'       => $request->php->ldap->admin_password,
  'real_primarygroup'    => $request->php->ldap->real_primarygroup,
  'use_ssl'              => $request->php->ldap->use_ssl,
  'use_tls'              => $request->php->ldap->use_tls,
  'recursive_groups'     => $request->php->ldap->recursive_groups,
  'ad_port'              => $request->php->ldap->ad_port,
  'sso'                  => $request->php->ldap->sso,
);
