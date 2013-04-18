<?php

class BeaconAuth
{
    var $auth_connector;
    var $user_id;
    var $username;
    var $password;
    var $ok;

    function BeaconAuth($auth_connector)
    {
        $this->auth_connector = $auth_connector;
        $this->user_id = 0;
        $this->username = "Guest";
        $this->ok = false;

        return $this->ok;
    }

    function check_session()
    {
        if(!empty($_SESSION['auth_username'])) {
            return true;
        } else {
            return false;
        }
    }

    function login($username, $password)
    {
        $user = $this->auth_connector->validate_user($username, $password);

        if($user)
        {
            if(array_key_exists('email',$user) && isset($user['email']) && !empty($user['email']))
            {
                $this->user_id = $user['uid'];
                $this->username = $username;
                $this->ok = true;

                $_SESSION['auth_username'] = $username;
                //$_SESSION['auth_password'] = $password;
                session_write_close();

                return true;
            }
        }
        return false;
    }

    function check($username, $password)
    {
        $user = $this->auth_connector->validate_user($username, $password);

        if($user)
        {
            if(array_key_exists('email',$user) && isset($user['email']) && !empty($user['email']))
            {
                $this->user_id = $user['uid'];
                $this->username = $username;
                $this->ok = true;
                return true;
            }
        }
        return false;
    }

    function logout()
    {
        $this->user_id = 0;
        $this->username = "Guest";
        $this->ok = false;

        $_SESSION['auth_username'] = "";
        $_SESSION['auth_password'] = "";
        session_write_close();
    }

}
