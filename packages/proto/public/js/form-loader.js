// public/js/form-loader.js

export class RestfulFormElement extends HTMLElement {
    static template = document.createElement('template');
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      RestfulFormElement.template.innerHTML = `
        <form autocomplete="off">
          <slot></slot>
          <button type="submit">Submit</button>
        </form>
        <style>
          form {
            display: grid; /* define your grid here */
          }
        </style>
      `;
      this.shadowRoot.appendChild(RestfulFormElement.template.content.cloneNode(true));
      this.form = this.shadowRoot.querySelector('form');
      this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
  
    connectedCallback() {
      const src = this.getAttribute('src');
      if (src) {
        this.loadJson(src);
      }
    }
  
    async loadJson(url) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          this.populateForm(data);
        } else {
          console.error('Failed to fetch JSON data', response.status);
        }
      } catch (error) {
        console.error('Error fetching JSON data', error);
      }
    }
  
    populateForm(data) {
      for (const key in data) {
        const input = this.form.querySelector(`[name=${key}]`);
        if (input) {
          input.value = data[key];
        }
      }
    }
  
    async handleSubmit(event) {
      event.preventDefault();
      const data = {};
      new FormData(this.form).forEach((value, key) => {
        data[key] = value;
      });
  
      const src = this.getAttribute('src');
      try {
        const response = await fetch(src, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const updatedData = await response.json();
          this.populateForm(updatedData);
        } else {
          console.error('Failed to update JSON data', response.status);
        }
      } catch (error) {
        console.error('Error updating JSON data', error);
      }
    }
  }
  
  customElements.define('restful-form', RestfulFormElement);
  