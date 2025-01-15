import { login, currentUser, logout } from './utils/auth.js';
    import { addLink, editLink as editLinkService, deleteLink as deleteLinkService, links } from './utils/links.js';
    import { getElements } from './utils/dom.js';

    function showError(message) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center';
      errorDiv.textContent = message;
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 5000);
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    function updateUI() {
      const { loginBtn, addBtn, logoutBtn } = getElements();
      if (currentUser) {
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        addBtn.classList.remove('hidden');
      } else {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        addBtn.classList.add('hidden');
      }
    }

    function renderLinks() {
      const { linksContainer } = getElements();
      if (!linksContainer) {
        showError('Erro: Container de links não encontrado.');
        return;
      }

      try {
        linksContainer.innerHTML = links.map(link => `
          <div class="bg-gray-800 rounded-lg p-6 space-y-4 mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div class="flex justify-between items-start">
              <h3 class="text-xl font-semibold">${link.title}</h3>
              <span class="text-sm text-gray-400">${formatDate(link.date)}</span>
            </div>
            <p class="text-gray-300">${link.description}</p>
            <a href="${link.url}" target="_blank" class="text-custom hover:underline flex items-center">
              <i class="fas fa-external-link-alt mr-2"></i>${link.url}
            </a>
            ${currentUser?.isAdmin ? `
              <div class="mt-2 flex space-x-4">
                <button onclick="handleEditLink('${link.id}')" class="flex items-center text-sm text-custom hover:text-custom/80">
                  <i class="fas fa-edit mr-2"></i>Editar
                </button>
                <button onclick="handleDeleteLink('${link.id}')" class="flex items-center text-sm text-red-500 hover:text-red-400">
                  <i class="fas fa-trash-alt mr-2"></i>Excluir
                </button>
              </div>
            ` : ''}
            <div class="border-t border-gray-700 pt-4 mt-4">
              <h4 class="font-medium mb-2">Comentários</h4>
              <div class="space-y-3">
                ${link.comments.map(comment => `
                  <div class="text-sm">
                    <p class="text-gray-300">${comment.text}</p>
                    <span class="text-gray-500">${comment.author} • ${formatDate(comment.date)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('');
      } catch (error) {
        showError('Erro ao renderizar links: ' + error.message);
      }
    }

    function setupEventListeners() {
      const {
        loginBtn,
        addBtn,
        logoutBtn,
        loginModal,
        addModal,
        loginForm,
        addForm,
        confirmDeleteBtn,
        cancelDeleteBtn
      } = getElements();

      if (!loginBtn || !addBtn || !logoutBtn || !loginModal || !addModal || !loginForm || !addForm || !confirmDeleteBtn || !cancelDeleteBtn) {
        showError('Erro crítico: Elementos do DOM não encontrados. Verifique o HTML.');
        return;
      }

      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        
        if (login(email, password)) {
          loginModal.classList.add('hidden');
          updateUI();
          renderLinks();
        } else {
          showError('Credenciais inválidas');
        }
      });

      logoutBtn.addEventListener('click', () => {
        logout();
        updateUI();
        renderLinks();
      });

      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = addForm.querySelector('input[type="text"]').value;
        const url = addForm.querySelector('input[type="url"]').value;
        const description = addForm.querySelector('textarea').value;
        
        addLink(title, url, description);
        addModal.classList.add('hidden');
        renderLinks();
      });

      confirmDeleteBtn.addEventListener('click', () => {
        const linkId = confirmDeleteBtn.dataset.linkId;
        if (linkId) {
          deleteLinkService(linkId);
          renderLinks();
        }
        document.getElementById('deleteModal').classList.add('hidden');
      });

      cancelDeleteBtn.addEventListener('click', () => {
        document.getElementById('deleteModal').classList.add('hidden');
      });

      loginBtn.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
      });

      addBtn.addEventListener('click', () => {
        addForm.reset();
        addModal.classList.remove('hidden');
      });

      window.handleEditLink = (id) => {
        const link = links.find(l => l.id === id);
        if (link) {
          addForm.querySelector('input[type="text"]').value = link.title;
          addForm.querySelector('input[type="url"]').value = link.url;
          addForm.querySelector('textarea').value = link.description;
          addModal.classList.remove('hidden');
          
          addForm.onsubmit = (e) => {
            e.preventDefault();
            const title = addForm.querySelector('input[type="text"]').value;
            const url = addForm.querySelector('input[type="url"]').value;
            const description = addForm.querySelector('textarea').value;
            if (editLinkService(id, title, url, description)) {
              addModal.classList.add('hidden');
              renderLinks();
            }
          };
        }
      };

      window.handleDeleteLink = (id) => {
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        confirmDeleteBtn.dataset.linkId = id;
        document.getElementById('deleteModal').classList.remove('hidden');
      };

      window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
          loginModal.classList.add('hidden');
        }
        if (e.target === addModal) {
          addModal.classList.add('hidden');
        }
        if (e.target === document.getElementById('deleteModal')) {
          document.getElementById('deleteModal').classList.add('hidden');
        }
      });
    }

    document.addEventListener('DOMContentLoaded', () => {
      try {
        // Adicionar alguns links de exemplo
        if (links.length === 0) {
          addLink('ChatGPT', 'https://chat.openai.com', 'Assistente de IA conversacional');
          addLink('Bard', 'https://bard.google.com', 'IA generativa do Google');
        }

        setupEventListeners();
        updateUI();
        renderLinks();
      } catch (error) {
        showError('Erro ao inicializar a aplicação: ' + error.message);
      }
    });
