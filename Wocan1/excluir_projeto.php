<?php
header("Content-Type: application/json");
include "conexao.php";

// Receber dados JSON
$dados = json_decode(file_get_contents("php://input"), true);
$id = $dados['id'] ?? 0;

if ($id > 0) {
    // Primeiro, verificar se existe arquivo associado para excluir
    $sql = "SELECT arquivo_caminho FROM projetos WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        // Se existir arquivo, excluir do sistema de arquivos
        if (!empty($row['arquivo_caminho']) && file_exists($row['arquivo_caminho'])) {
            unlink($row['arquivo_caminho']);
        }
    }
    
    // Excluir registro do banco de dados
    $sql = "DELETE FROM projetos WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Projeto excluído com sucesso!"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Erro ao excluir projeto: " . $stmt->error
        ]);
    }
    
    $stmt->close();
} else {
    echo json_encode([
        "success" => false,
        "message" => "ID de projeto inválido"
    ]);
}

$conn->close();
?>