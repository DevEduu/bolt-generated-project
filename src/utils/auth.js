export const users = [
      {
        email: 'admin@example.com',
        password: 'admin123',
        isAdmin: true
      }
    ];

    export let currentUser = null;

    /**
     * Realiza o login do usuário.
     * @param {string} email - Email do usuário.
     * @param {string} password - Senha do usuário.
     * @returns {boolean} - True se o login for bem-sucedido, False caso contrário.
     */
    export function login(email, password) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        currentUser = user;
        return true;
      }
      return false;
    }

    /**
     * Realiza o logout do usuário.
     */
    export function logout() {
      currentUser = null;
    }
