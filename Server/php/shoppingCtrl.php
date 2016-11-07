<?php

require_once 'controller.php';

class ShoppingCtrl extends Controller {

    protected function get() {
        return $this->getSql('shopping_list_details');
    }

    protected function getFields() {
        return array('product_id' => true, 'user_id' => true, 'quantity' => true);
    }

    protected function getTable() {
        return 'shopping_list';
    }

    protected function getOrderBy() {
        return array('name ASC', 'date_added DESC');
    }
}
