<?php
header("Content-Type: application/json");
include "conexao.php";

// Consultar projetos no banco de dados
$sql = "SELECT * FROM projetos ORDER BY data_criacao DESC";
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