document.addEventListener('DOMContentLoaded', function() {
    // Carregar projetos ao iniciar a página
    carregarProjetos();
    
    // Adicionar eventos aos botões de filtro
    const btnFiltrar = document.getElementById('btn-filtrar');
    const btnLimpar = document.getElementById('btn-limpar');
    
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', function() {
            carregarProjetos(true);
        });
    }
    
    if (btnLimpar) {
        btnLimpar.addEventListener('click', function() {
            document.getElementById('filtro-categoria').value = '';
            document.getElementById('filtro-linguagem').value = '';
            carregarProjetos();
        });
    }
});

// Função para carregar projetos do banco de dados
function carregarProjetos(filtrar = false) {
    const listaProjetos = document.getElementById('lista-projetos');
    let url = 'listar_projetos_usuario.php';
    
    // Adicionar parâmetros de filtro se necessário
    if (filtrar) {
        const categoria = document.getElementById('filtro-categoria').value;
        const linguagem = document.getElementById('filtro-linguagem').value;
        
        if (categoria || linguagem) {
            url += '?';
            if (categoria) url += 'categoria=' + encodeURIComponent(categoria);
            if (categoria && linguagem) url += '&';
            if (linguagem) url += 'linguagem=' + encodeURIComponent(linguagem);
        }
    }
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Limpar lista atual
            listaProjetos.innerHTML = '';
            
            // Verificar se há projetos
            if (data.projetos.length === 0) {
                listaProjetos.innerHTML = '<div class="mensagem-info">Nenhum projeto encontrado com os filtros selecionados.</div>';
                return;
            }
            
            // Adicionar projetos à lista
            data.projetos.forEach(projeto => {
                const card = document.createElement('div');
                card.className = 'projeto-card';
                
                // Verificar se os campos existem antes de exibi-los
                const categoria = projeto.categoria || 'Não especificada';
                const linguagem = projeto.linguagem || 'Não especificada';
                const descricao = projeto.descricao || 'Sem descrição';
                const autor = projeto.autor || 'Não especificado';
                const data = projeto.data ? formatarData(projeto.data) : 'Não especificada';
                
                let arquivoHtml = '';
                if (projeto.arquivo_nome) {
                    arquivoHtml = `
                        <div class="projeto-arquivo">
                            <a href="${projeto.arquivo_caminho}" target="_blank" class="btn-download">
                                Baixar Arquivo
                            </a>
                        </div>
                    `;
                }
                
                card.innerHTML = `
                    <h3 class="projeto-titulo">${projeto.nome}</h3>
                    <div class="projeto-info">
                        <p><strong>Categoria:</strong> ${categoria}</p>
                        <p><strong>Linguagem:</strong> ${linguagem}</p>
                        <p><strong>Autor:</strong> ${autor}</p>
                        <p><strong>Data:</strong> ${data}</p>
                    </div>
                    <div class="projeto-descricao">
                        <p>${descricao}</p>
                    </div>
                    ${arquivoHtml}
                    ${projeto.link ? `<a href="${projeto.link}" target="_blank" class="btn-ver-projeto">Ver Projeto</a>` : ''}
                `;
                
                listaProjetos.appendChild(card);
            });
        } else {
            listaProjetos.innerHTML = `<div class="mensagem-erro">Erro ao carregar projetos: ${data.message}</div>`;
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        listaProjetos.innerHTML = '<p class="erro">Ocorreu um erro ao carregar os projetos.</p>';
    });
}

// Função para formatar data
function formatarData(dataString) {
    if (!dataString) return '';
    
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}
