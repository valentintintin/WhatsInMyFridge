<?php

abstract class Controller {
    protected $db;
    protected $id = null;
    protected $data = array();

    function __construct($id = null, $data = null) {
        $this->id = $id;
        $this->data = $data;
        try {
            $this->db = new PDO('mysql:host=localhost;dbname=whatsinmyfridge', 'root', '0623270268', array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
        } catch (PDOException $e) {
            echo "Erreur !: " . $e->getMessage();
            die();
        }
    }

    public function process($method) {
        $result = false;

        switch ($method) {
            case 'GET':
                $result = $this->get();
                break;

            case 'POST':
                $result = $this->post();
                break;

            case 'PUT':
                $result = $this->put();
                break;

            case 'DELETE':
                $result = $this->delete();
                break;
        }

        return json_encode($result);
    }

    abstract protected function getPrimaryKey();

    abstract protected function getFields();

    protected function getSql($table) {
        $req ='SELECT * FROM ' . $table;
        $data = array();
        if ($this->id) {
            $req .= ' WHERE ' . $this->getPrimaryKey() . ' = ?';
            $data[] = $this->id;
        }
        $stmt = $this->db->prepare($req);
        if ($stmt->execute($data)) {
            if ($this->id) return $stmt->fetch(PDO::FETCH_ASSOC);
            else return array_map('reset', $stmt->fetchAll(PDO::FETCH_GROUP|PDO::FETCH_ASSOC));
        } else return array("error" => array('error' => $stmt->errorInfo()[2],
            'SQL' => $req,
            'id' => $this->id,
            'datas' => $this->data));
    }

    protected function get() {
        $this->data = $this->getSql($this->getTable());
        return $this->data;
    }

    protected function post() {
        $req = 'INSERT INTO ' . $this->getTable() . ' SET';
        $req .= $this->generateSetSQL(true);
        $stmt = $this->db->prepare($req);
        if ($stmt->execute($this->data)) return true;
        else return array("error" => array('error' => $stmt->errorInfo()[2],
            'SQL' => $req,
            'id' => $this->id,
            'datas' => $this->data));
    }

    protected function put() {
        $req = 'UPDATE ' . $this->getTable() . ' SET';
        $req .= $this->generateSetSQL();
        $req .= ' WHERE ' . $this->getPrimaryKey() . ' = :' . $this->getPrimaryKey();
        $stmt = $this->db->prepare($req);
        if ($stmt->execute($this->data)) return true;
        else return array("error" => array('error' => $stmt->errorInfo()[2],
            'SQL' => $req,
            'id' => $this->id,
            'datas' => $this->data));
    }

    protected function delete() {
        $req = 'DELETE FROM ' . $this->getTable() . ' WHERE ' . $this->getPrimaryKey() . ' = ?';
        $stmt = $this->db->prepare($req);
        if ($stmt->execute(array($this->id))) return true;
        else return array("error" => array('error' => $stmt->errorInfo()[2],
            'SQL' => $req,
            'id' => $this->id,
            'datas' => $this->data));
    }


    protected function generateSetSQL($withPrimaryKey = false) {
        $fields = $this->getFields();
        $req = '';
        foreach ($this->data as $key => $value) {
            if (in_array($key, $fields) || (!$withPrimaryKey && $key != $this->getPrimaryKey())) $req .= ' ' . $key . ' = :' . $key . ',';
        }
        $req = rtrim($req, ",");
        return $req;
    }

    protected function getTable() {
        return str_replace('ctrl', '', strtolower(get_class($this)));
    }
}