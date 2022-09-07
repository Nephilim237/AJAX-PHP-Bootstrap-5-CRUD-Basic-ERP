<?php

class Database
{
    private $host = "mysql:dbname=crud_ajax";
    private $user = "root";
    private $pswd = "root";

    private function getconnexion()
    {
        try {
            return new PDO($this->host, $this->user, $this->pswd);
        } catch (PDOException $e) {
            die('Erreur:' . $e->getMessage());
        }
    }

    public function create(string $customer, string $cashier, int $amount, int $received, int $returned, string $state)
    {
        $q = $this->getconnexion()->prepare("INSERT INTO factures (customer, cashier, amount, received, returned, state) VALUES (:customer, :cashier, :amount, :received, :returned, :state)");
        return $q->execute([
            'customer' => $customer,
            'cashier' => $cashier,
            'amount' => $amount,
            'received' => $received,
            'returned' => $returned,
            'state' => $state
        ]);
    }

    public function read()
    {
        return $this->getconnexion()->query("SELECT * FROM factures ORDER BY id")->fetchAll(PDO::FETCH_OBJ);
    }

    public function countBills(): int
    {
        return (int)$this->getconnexion()->query("SELECT COUNT(id) as count FROM factures")->fetch()[0];
    }

    public function getSingleBill(int $id)
    {
        $q = $this->getconnexion()->prepare("SELECT * FROM factures WHERE  id = :id");
        $q->execute(['id' => $id]);
        return $q->fetch(PDO::FETCH_OBJ);
    }

    public function update(int $id, string $customer, string $cashier, int $amount, int $received, int $returned, string $state)
    {
        $q = $this->getconnexion()->prepare("UPDATE factures SET customer = :customer, cashier = :cashier, amount = :amount, received = :received, returned = :returned, state = :state WHERE id = :id");
        return $q->execute([
            'customer' => $customer,
            'cashier' => $cashier,
            'amount' => $amount,
            'received' => $received,
            'returned' => $returned,
            'state' => $state,
            'id'     => $id
        ]);
    }

    public function delete(int $id): bool
    {
        $q = $this->getconnexion()->prepare("DELETE FROM factures WHERE id = :id");
        return $q->execute(['id' => $id ]);
    }
}