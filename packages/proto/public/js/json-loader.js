// public/js/json-loader.js

import { addFragment } from "./html-loader.js"; // Ensure this file exists or create a stub
import { prepareTemplate } from "./template.js"; // Ensure this file exists or create a stub

export class JsonObjectElement extends HTMLElement {
  static template = prepareTemplate(`<template>
    <div id="content"></div>
  </template>`);

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      JsonObjectElement.template.content.cloneNode(true)
    );
    this.contentDiv = this.shadowRoot.querySelector("#content");
  }

  connectedCallback() {
    const src = this.getAttribute('src');
    if (src) {
      this.loadJson(src);
    }
    if (this.hasAttribute('open')) {
      this.open();
    }
  }

  async loadJson(url) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        this.render(data);
      } else {
        console.error('Failed to fetch JSON data', response.status);
      }
    } catch (error) {
      console.error('Error fetching JSON data', error);
    }
  }

  render(data) {
    this.contentDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }

  open() {
    this.loadJson(this.getAttribute('src'));
  }
}

customElements.define("json-object", JsonObjectElement);
