<?php

require_once("adLDAP/src/adLDAP.php");

class BeaconLDAP
{
  
  private $adGroup = "DocBook User";
  private $adldap = NULL;
  
  function BeaconLDAP($ldap_configuration)
  {
    
    $this->adldap = new adLDAP($ldap_configuration);

  }
  
    public function validate_user($username, $password)
    {
      
      //$authUser = $adldap->user()->authenticate($username, $password) && $adldap->user()->inGroup($username,$this->adGroup);
      
      $authUser = $this->adldap->user()->authenticate($username, $password);
    
      if ($authUser == true) {
        
        $result=$this->adldap->user()->info($username,array("*"));
        $result = $result[0];
        $result_keys = array_keys($result);
        $info = array();
        foreach($result_keys as $key) {
          if(!is_int($key)){
            $value = $result[$key][0];
            if($key==='objectguid'){
              $value = hexdec($value);
            }
            $info[$key] = $value;
          }
        }
        
        $user = array();
        
        $user['uid'] = $info['objectguid'];
        $user['username'] = $info['samaccountname'];
        $user['password'] = '';
        $user['email'] = strtolower($info['mail']);

        return $user;
        
      }else{
        return false;
      }
    }

}
