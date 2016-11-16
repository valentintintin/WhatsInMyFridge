<?php

require_once 'productCtrl.php';

class UtilsCtrl extends ProductCtrl {

    protected function getTable() {
        return 'product';
    }

    public function process() {
        return $this->refreshDataOpen();
    }

    public function refreshDataOpen() {
        echo "\tGet all product with no openData\n\n";
        $req = 'SELECT * FROM product WHERE image IS NULL OR image = ""';
        $stmt = $this->db->prepare($req);
        if ($stmt->execute()) {
            $count = $stmt->rowCount();
            $i = 1;
            $failed = 0;
            $ok = 0;
            echo $count . " products to process\n\n";
            while ($row = $stmt->fetch()) {
                echo "\n*****************************\n";
                echo "\tProduct " . $i . "/" . $count . "\n";
                print_r($row);
                echo "\n";
                $openData = ProductCtrl::getOpenFoodData($row['id']);
                if ((isset($openData['name']) && $row['name'] != $openData['name']) || isset($openData['image'])) {
                    $this->data = $openData;
                    $rReq = $this->put();
                    if (isset($rReq['error'])) {
                        echo "\n\n\n\tError !!\n";
                        print_r($rReq);
                        die;
                    }
                    echo "\tOpenData:\n";
                    print_r($openData);
                    echo "OK.\n";
                    $ok++;
                } else {
                    echo "No openData\n";
                    $failed++;
                }
                $i++;
            }
            echo "\n\n\tProducts OK: " . $ok . "\t\tFailed: " . $failed;
        } else {
            print_r(array("error" => array('error' => $stmt->errorInfo()[2],
                'SQL' => $req,
                'id' => $this->id,
                'datas' => $this->data)));
        }
    }
}
