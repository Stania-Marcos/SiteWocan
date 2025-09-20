<?php
header("Content-Type: application/json");
include "conexao.php";

// Receber parâmetros de filtro
$categoria = isset($_GET['categoria']) ? $_GET['categoria'] : '';
$linguagem = isset($_GET['linguagem']) ? $_GET['linguagem'] : '';

// Construir consulta SQL com filtros
$sql = "SELECT * FROM projetos WHERE status = 'Publicado'";

if (!empty($categoria)) {
    $sql .= " AND categoria = '" . $conn->real_escape_string($categoria) . "'";
}

if (!empty($linguagem)) {
    $sql .= " AND linguagem LIKE '%" . $conn->real_escape_string($linguagem) . "%'";
}

$sql .= " ORDER BY data_upload DESC";

$result = $conn->query($sql);

if ($result) {
    $projetos = [];
    
    while ($row = $result->fetch_assoc()) {
        $projetos[] = $row;
    }
    
    echo json_encode([
        "success" => true,
        "projetos" => $projetos
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao consultar projetos: " . $conn->error
    ]);
}

$conn->close();
?>