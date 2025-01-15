import { v4 as uuidv4 } from 'uuid';

    export let links = JSON.parse(localStorage.getItem('links')) || [];

    /**
     * Adiciona um novo link.
     * @param {string} title - Título do link.
     * @param {string} url - URL do link.
     * @param {string} description - Descrição do link.
     * @returns {object} - O link adicionado.
     */
    export function addLink(title, url, description) {
      const newLink = {
        id: uuidv4(),
        title,
        url,
        description,
        comments: [],
        date: new Date().toLocaleString()
      };
      links.push(newLink);
      localStorage.setItem('links', JSON.stringify(links));
      return newLink;
    }

    /**
     * Edita um link existente.
     * @param {string} id - ID do link.
     * @param {string} title - Novo título do link.
     * @param {string} url - Nova URL do link.
     * @param {string} description - Nova descrição do link.
     * @returns {boolean} - True se a edição for bem-sucedida, False caso contrário.
     */
    export function editLink(id, title, url, description) {
      const link = links.find(l => l.id === id);
      if (link) {
        link.title = title;
        link.url = url;
        link.description = description;
        localStorage.setItem('links', JSON.stringify(links));
        return true;
      }
      return false;
    }

    /**
     * Exclui um link.
     * @param {string} id - ID do link.
     */
    export function deleteLink(id) {
      links = links.filter(l => l.id !== id);
      localStorage.setItem('links', JSON.stringify(links));
    }
