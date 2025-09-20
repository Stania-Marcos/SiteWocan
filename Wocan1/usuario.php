<?php
header("Content-Type: application/json");
include "conexao.php";

$sql = "SELECT * FROM projetos WHERE status='Publicado' ORDER BY id DESC";
$result = $conn->query($sql);

$projetos = [];

while ($row = $result->fetch_assoc()) {
    $projetos[] = $row;
}

echo json_encode($projetos);

$conn->close();
?>
