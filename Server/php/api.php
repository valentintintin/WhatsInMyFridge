<?php

require_once 'header.php';

require_once 'productCtrl.php';
require_once 'fridgeCtrl.php';
require_once 'shoppingCtrl.php';
require_once 'userCtrl.php';
require_once 'utilsCtrl.php';

$controller = null;
switch ($table) {
    case 'product':
        $controller = new ProductCtrl($id, $data);
        break;

    case 'fridge':
        $controller = new FridgeCtrl($id, $data);
        break;

    case 'shopping':
        $controller = new ShoppingCtrl($id, $data);
        break;

    case 'user':
        $controller = new UserCtrl($id, $data);
        break;

    case 'utils':
        $controller = new UtilsCtrl($id, $data);
        break;

    default:
        echo false;
        die;
}

echo $controller->process($method);