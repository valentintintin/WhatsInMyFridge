<?php

require_once 'controller.php';

class UserCtrl extends Controller {

    protected function get() {
        return $this->getSql('user');
    }

    protected function getFields() {
        return array('id' => false, 'username' => true, 'password' => true, 'date_added' => 'now()');
    }
}
