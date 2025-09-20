<?php
// Ativar exibição de erros no desenvolvimento (remova ou ajuste em produção)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Não exibir erros na tela para não quebrar JSON
ini_set('display_startup_errors', 0);
ini_set('log_errors', 1); // Loga erros em um arquivo
ini_set('error_log', __DIR__ . '/errors.log'); // Arquivo de log na mesma pasta do script

header("Content-Type: application/json");
include "conexao.php";

// Verificar se a conexão com o banco foi estabelecida
if (!$conn) {
    error_log("Erro de conexão com o banco de dados: " . mysqli_connect_error());
    echo json_encode(["success" => false, "message" => "Erro de conexão com o banco de dados"]);
    exit;
}

// A tabela projetos já existe no banco de dados WOCAN

// Criar pasta de uploads se não existir
$uploadDir = "uploads/";
if (!file_exists($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) {
        error_log("Erro ao criar diretório de uploads: " . error_get_last()['message']);
        echo json_encode(["success" => false, "message" => "Erro ao criar diretório de uploads"]);
        exit;
    }
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Verificar campos obrigatórios
    if (empty($_POST["nome"]) || empty($_POST["link"])) {
        error_log("Campos obrigatórios faltando: nome ou link");
        echo json_encode(["success" => false, "message" => "Nome do projeto e URL são obrigatórios"]);
        exit;
    }
    
    $nome = $_POST["nome"];
    $categoria = $_POST["categoria"] ?? "";
    $linguagem = $_POST["linguagem"] ?? "";
    $descricao = $_POST["descricao"] ?? "";
    $link = $_POST["link"];
    $epoca = $_POST["epoca"] ?? "";
    $data = $_POST["data"] ?? date("Y-m-d");
    $autor = $_POST["autor"] ?? "";
    $status = $_POST["status"] ?? "Rascunho";
    $versao = $_POST["versao"] ?? "";
    
    // Processar upload de arquivo
    $arquivo_nome = "";
    $arquivo_caminho = "";
    
    if (isset($_FILES['arquivo']) && $_FILES['arquivo']['error'] == 0 && !empty($_FILES['arquivo']['name'])) {
        $arquivo_temp = $_FILES['arquivo']['tmp_name'];
        $arquivo_nome = $_FILES['arquivo']['name'];
        $arquivo_caminho = $uploadDir . time() . '_' . $arquivo_nome;
        
        // Move o arquivo para a pasta de uploads
        if (!move_uploaded_file($arquivo_temp, $arquivo_caminho)) {
            $upload_error = error_get_last() ? error_get_last()['message'] : "Erro desconhecido ao mover arquivo";
            error_log("Erro ao fazer upload do arquivo '$arquivo_nome': " . $upload_error);
            $arquivo_nome = "";
            $arquivo_caminho = "";
        }
    }

    // Inserir dados no banco de dados
    $sql = "INSERT INTO projetos (nome, categoria, linguagem, descricao, link, epoca, data, autor, status, versao, arquivo_nome, arquivo_caminho) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        $error = "Erro na preparação da consulta: " . $conn->error;
        error_log($error);
        echo json_encode(["success" => false, "message" => $error]);
        exit;
    }
    
    $stmt->bind_param("ssssssssssss", $nome, $categoria, $linguagem, $descricao, $link, $epoca, $data, $autor, $status, $versao, $arquivo_nome, $arquivo_caminho);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Projeto salvo com sucesso!", "id" => $conn->insert_id]);
    } else {
        $error = "Erro ao salvar projeto: " . $stmt->error;
        error_log($error);
        echo json_encode(["success" => false, "message" => $error]);
    }

    $stmt->close();
    $conn->close();
} else {
    error_log("Método HTTP inválido: " . $_SERVER["REQUEST_METHOD"]);
    echo json_encode(["success" => false, "message" => "Método HTTP inválido"]);
}
?>