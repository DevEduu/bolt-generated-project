export function getElements() {
      const elements = {
        loginBtn: document.getElementById('loginBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        addBtn: document.getElementById('addBtn'),
        loginModal: document.getElementById('loginModal'),
        addModal: document.getElementById('addModal'),
        loginForm: document.getElementById('loginModal')?.querySelector('form'),
        addForm: document.getElementById('addModal')?.querySelector('form'),
        linksContainer: document.getElementById('linksContainer'),
        confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
        cancelDeleteBtn: document.getElementById('cancelDeleteBtn')
      };

      // Verificação de elementos críticos
      const requiredElements = ['loginBtn', 'logoutBtn', 'addBtn', 'loginModal', 'addModal', 'loginForm', 'addForm', 'linksContainer', 'confirmDeleteBtn', 'cancelDeleteBtn'];
      const missingElements = requiredElements.filter(key => !elements[key]);

      if (missingElements.length > 0) {
        console.error('Elementos do DOM não encontrados:', missingElements);
        return null;
      }

      return elements;
    }
