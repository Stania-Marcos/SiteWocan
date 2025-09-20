document.addEventListener('DOMContentLoaded', function() {
    // Referência ao formulário
    const formProjeto = document.getElementById('formProjeto');
    
    // Esconder a barra de erro inicialmente
    const erroForm = document.getElementById('erro-form');
    erroForm.style.display = 'none';
    
    // Carregar projetos existentes
    carregarProjetos();
    
    // Adicionar evento de envio do formulário
    formProjeto.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Verificar campos obrigatórios
        const nome = formProjeto.querySelector('[name="nome"]').value.trim();
        const link = formProjeto.querySelector('[name="link"]').value.trim();
        
        if (!nome || !link) {
            const erroForm = document.getElementById('erro-form');
            erroForm.style.display = 'block';
            erroForm.style.color = '#FFD700';
            erroForm.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            erroForm.style.border = '1px solid #FFD700';
            erroForm.textContent = 'Nome do projeto e URL são obrigatórios';
            return;
        }
        
        // Mostrar mensagem de carregamento
        const erroForm = document.getElementById('erro-form');
        erroForm.style.display = 'block';
        erroForm.style.color = '#FFD700';
        erroForm.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        erroForm.style.border = '1px solid #FFD700';
        erroForm.textContent = 'Salvando projeto...';
        
        // Criar FormData para enviar dados incluindo arquivos
        const formData = new FormData(formProjeto);
        
        // Enviar dados para o servidor
        fetch('adim.php', {
            method: 'POST',
            body: formData
        })
        .then(async response => {
            const text = await response.text();
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor: ' + response.status + ' - ' + text.slice(0, 300));
            }
            try {
                return JSON.parse(text);
            } catch (err) {
                console.error('Resposta não-JSON do servidor (primeiros 500 chars):', text.slice(0, 500));
                throw new Error('Resposta não-JSON do servidor');
            }
        })
        .then(data => {
            if (data.success) {
                erroForm.style.display = 'block';
                erroForm.style.color = '#FFD700';
                erroForm.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                erroForm.style.border = '1px solid #FFD700';
                erroForm.textContent = data.message;
                formProjeto.reset();
                carregarProjetos(); // Recarregar a lista após salvar
                
                // Esconder a mensagem após 3 segundos
                setTimeout(() => {
                    erroForm.style.display = 'none';
                }, 3000);
            } else {
                erroForm.style.display = 'block';
                erroForm.style.color = '#FFD700';
                erroForm.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                erroForm.style.border = '1px solid #FFD700';
                erroForm.textContent = 'Erro: ' + data.message;
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            const erroForm = document.getElementById('erro-form');
            erroForm.style.display = 'block';
            erroForm.style.color = '#FFD700';
            erroForm.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            erroForm.style.border = '1px solid #FFD700';
            erroForm.textContent = 'Ocorreu um erro ao salvar o projeto. Por favor, tente novamente.';
            
            // Mostrar o erro acima do botão
            erroForm.scrollIntoView({behavior: 'smooth'});
        });
    });
});

// Função para carregar projetos existentes
function carregarProjetos() {
    const listaProjetos = document.getElementById('lista-projetos');
    
    fetch('listar_projetos.php')
    .then(response => response.json())
    .then(data => {
        if (data.success && data.projetos.length > 0) {
            let html = '<div class="projetos-grid">';
            
            data.projetos.forEach(projeto => {
                html += `
                    <div class="projeto-card">
                        <h3>${projeto.nome}</h3>
                        <p><strong>Categoria:</strong> ${projeto.categoria || 'Não especificada'}</p>
                        <p><strong>Linguagem:</strong> ${projeto.linguagem || 'Não especificada'}</p>
                        <p><strong>Descrição:</strong> ${projeto.descricao || 'Sem descrição'}</p>
                        <p><strong>Link:</strong> <a href="${projeto.link}" target="_blank">Ver projeto</a></p>
                        <p><strong>Data:</strong> ${projeto.data || 'Não especificada'}</p>
                        <p><strong>Status:</strong> ${projeto.status || 'Não especificado'}</p>
                        ${projeto.arquivo_nome ? `<p><strong>Arquivo:</strong> <a href="${projeto.arquivo_caminho}" target="_blank">${projeto.arquivo_nome}</a></p>` : ''}
                        <button class="excluir-projeto" data-id="${projeto.id}">Excluir</button>
                    </div>
                `;
            });
            
            html += '</div>';
            listaProjetos.innerHTML = html;
            
            // Adicionar eventos aos botões de excluir
            document.querySelectorAll('.excluir-projeto').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    excluirProjeto(id);
                });
            });
        } else {
            listaProjetos.innerHTML = '<p class="mensagem-info">Nenhum projeto encontrado.</p>';
        }
    })
    .catch(error => {
        console.error('Erro ao carregar projetos:', error);
        listaProjetos.innerHTML = '<p class="mensagem-erro">Ocorreu um erro ao carregar os projetos.</p>';
    });
}

// Função para excluir um projeto
function excluirProjeto(id) {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
        fetch('excluir_projeto.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                carregarProjetos(); // Recarregar a lista após excluir
            } else {
                alert('Erro: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao excluir o projeto.');
        });
    }
}
