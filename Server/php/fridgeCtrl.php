<?php

require_once 'controller.php';

class FridgeCtrl extends Controller {

    protected function get() {
        return $this->getSql('fridge_list_details');
    }

    protected function getPrimaryKey() {
        return $this->getFields()[0];
    }

    protected function getFields() {
        return array('product_id', 'user_id', 'quantity');
    }

    protected function getTable() {
        return 'fridge_list';
    }
}
