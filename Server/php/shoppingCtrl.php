<?php

require_once 'controller.php';

class ShoppingCtrl extends Controller {

    protected function get() {
        return $this->getSql('shopping_list_details');
    }

    protected function getPrimaryKey() {
        return $this->getFields()[0];
    }

    protected function getFields() {
        return array('product_id', 'user_id', 'quantity');
    }

    protected function getTable() {
        return 'shopping_list';
    }
}
