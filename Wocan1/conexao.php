<?php
// Mostrar todos os erros, mas sem exibir na tela
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

// Dados de conexão
$host = "localhost";
$user = "root";
$pass = "03082022";
$db   = "WOCAN";

// Verifica se o banco de dados existe, se não, cria
$temp_conn = new mysqli($host, $user, $pass);
if ($temp_conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Erro de conexão: " . $temp_conn->connect_error]));
}

// Cria o banco de dados se não existir
$temp_conn->query("CREATE DATABASE IF NOT EXISTS $db");
$temp_conn->close();

// Conecta ao banco de dados
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Erro de conexão ao banco: " . $conn->connect_error]));
}

// Cria a tabela projetos se não existir
$sql = "CREATE TABLE IF NOT EXISTS projetos (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    linguagem VARCHAR(100),
    descricao TEXT,
    link VARCHAR(255) NOT NULL,
    epoca VARCHAR(100),
    data DATE,
    autor VARCHAR(100),
    status VARCHAR(50),
    versao VARCHAR(50),
    arquivo_nome VARCHAR(255),
    arquivo_caminho VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (!$conn->query($sql)) {
    die(json_encode(["success" => false, "message" => "Erro ao criar tabela: " . $conn->error]));
}

// Verifica erro de conexão
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Erro de conexão: " . $conn->connect_error]));
}

// Tabela já foi criada acima, não precisamos criar novamente
// Removendo mensagens de texto que interferem no JSON
