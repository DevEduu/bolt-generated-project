class ApiService {
      constructor() {
        this.baseUrl = import.meta.env.VITE_API_BASE_URL;
        this.endpoints = {
          links: import.meta.env.VITE_API_LINKS_ENDPOINT,
          comments: import.meta.env.VITE_API_COMMENTS_ENDPOINT,
          auth: import.meta.env.VITE_API_AUTH_ENDPOINT,
        };
      }

      // Método genérico para fazer requisições
      async request(endpoint, method = 'GET', body = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
          'Content-Type': 'application/json',
        };

        const options = {
          method,
          headers,
        };

        if (body) {
          options.body = JSON.stringify(body);
        }

        try {
          const response = await fetch(url, options);
          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
          }
          return await response.json();
        } catch (error) {
          console.error('Erro na requisição:', error);
          throw error;
        }
      }

      // Endpoint: Adicionar um novo link
      async addLink(title, url, description) {
        return this.request(this.endpoints.links, 'POST', { title, url, description });
      }

      // Endpoint: Editar um link existente
      async editLink(id, title, url, description) {
        return this.request(`${this.endpoints.links}/${id}`, 'PUT', { title, url, description });
      }

      // Endpoint: Excluir um link
      async deleteLink(id) {
        return this.request(`${this.endpoints.links}/${id}`, 'DELETE');
      }

      // Endpoint: Listar todos os links
      async getLinks() {
        return this.request(this.endpoints.links);
      }

      // Endpoint: Adicionar um comentário a um link
      async addComment(linkId, text, author) {
        return this.request(`${this.endpoints.links}/${linkId}${this.endpoints.comments}`, 'POST', { text, author });
      }

      // Endpoint: Listar comentários de um link
      async getComments(linkId) {
        return this.request(`${this.endpoints.links}/${linkId}${this.endpoints.comments}`);
      }

      // Endpoint: Autenticar usuário
      async login(email, password) {
        return this.request(`${this.endpoints.auth}/login`, 'POST', { email, password });
      }

      // Endpoint: Deslogar usuário
      async logout() {
        return this.request(`${this.endpoints.auth}/logout`, 'POST');
      }
    }

    // Instância da ApiService
    const apiService = new ApiService();

    export default apiService;
