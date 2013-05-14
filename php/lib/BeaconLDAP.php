<?php

require_once("adLDAP/src/adLDAP.php");

class BeaconLDAP
{
  
  private $require_group = FALSE;
  private $required_group = "DocBook User";
  private $adldap = NULL;
  
  function BeaconLDAP($ldap_configuration)
  {
    
    if(array_key_exists('required_group',$ldap_configuration) && isset($ldap_configuration['required_group']) && !empty($ldap_configuration['required_group'])){
      $this->require_group = TRUE;
      $this->required_group = $ldap_configuration['required_group'];
    }
    
    unset($ldap_configuration['required_group']);
    
    $this->adldap = new adLDAP($ldap_configuration);

  }
  
    public function validate_user($username, $password)
    {
      
      $authUser = FALSE;
      
      if($this->require_group){
        $authUser = $this->adldap->user()->authenticate($username, $password) && $this->adldap->user()->inGroup($username,$this->required_group);
      }else{
        $authUser = $this->adldap->user()->authenticate($username, $password);
      }
    
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
