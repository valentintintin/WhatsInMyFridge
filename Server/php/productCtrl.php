<?php

require_once 'controller.php';

class ProductCtrl extends Controller {

    protected function get() {
        parent::get();

        if ($this->id) {
            if (!isset($this->data['name'])) {
                $openData = ProductCtrl::getOpenFoodData($this->id);
                if (isset($openData['name'])) {
                    $this->data = $openData;
                    $rReq = $this->post();
                    if (isset($rReq['error'])) return $rReq;
                }
            } elseif (!isset($this->data['image'])) {
                $openData = ProductCtrl::getOpenFoodData($this->id);
                if ((isset($openData['name']) && $this->data['name'] != $openData['name']) || isset($openData['image'])) {
                    $this->data = $openData;
                    $rReq = $this->put();
                    if (isset($rReq['error'])) return $rReq;
                }
            }
        }

        return $this->data;
    }

    public static function getOpenFoodData($id) {
        $data = array();
        $openData = json_decode(file_get_contents('http://world.openfoodfacts.org/api/v0/product/' . $id));
        if (isset($openData->product) && $openData->product->id != "") {
            $openData = $openData->product;

            $data['id'] = $openData->id;

            if (isset($openData->product_name_fr)) $data['name'] = $openData->product_name_fr;
            else $data['name'] = $openData->product_name;

            if (isset($openData->image_small_url)) $data['image'] = $openData->image_small_url;
            else $data['image'] = null;
        }

        return $data;
    }

    private function compare($data, $openData) {
        return (isset($data['name']) && isset($openData['name']) && $data['name'] == $openData['name'])
                || (isset($data['image']) && isset($openData['image']) && $data['image'] == $openData['image']);
    }

    protected function getPrimaryKey() {
        return $this->getFields()[0];
    }

    protected function getFields() {
        return array('id', 'name', 'image');
    }
}
