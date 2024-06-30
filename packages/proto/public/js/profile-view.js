// public/js/profile-view.js
import { prepareTemplate, loadJSON } from "./utils.js";
import { Auth, Observer } from "@calpoly/mustang";

export class ProfileViewElement extends HTMLElement {
  static styles = `
    * {
      margin: 0;
      box-sizing: border-box;
    }
    section {
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    h1 {
      font-size: 1.5em;
      margin-bottom: 8px;
    }
    dl {
      display: flex;
      flex-wrap: wrap;
    }
    dt, dd {
      flex: 1;
      padding: 8px;
      margin: 0;
    }
    dt {
      font-weight: bold;
    }
  `;

  static template = prepareTemplate(`
    <template>
      <section>
        <slot name="avatar"></slot>
        <h1><slot name="name"></slot></h1>
        <dl>
          <dt>Username</dt>
          <dd><slot name="userid"></slot></dd>
          <dt>Home</dt>
          <dd><slot name="home"></slot></dd>
          <dt>Nickname</dt>
          <dd><slot name="nickname"></slot></dd>
          <dt>Favorite Color</dt>
          <dd><slot name="color"></slot></dd>
          <dt>Airports</dt>
          <dd><slot name="airports"></slot></dd>
        </dl>
        <style>${ProfileViewElement.styles}</style>
      </section>
    </template>
  `);

  _authObserver = new Observer(this, "blazing:auth");

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      ProfileViewElement.template.content.cloneNode(true)
    );
  }

  get src() {
    return this.getAttribute("src");
  }

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      this._user = user;

      if (this.src) {
        loadJSON(this.src, this.renderSlots.bind(this), this.authorization);
      }
    });
  }

  get authorization() {
    console.log("Authorization for user, ", this._user);
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`
      }
    );
  }

  renderSlots(json) {
    const entries = Object.entries(json);
    const slot = ([key, value]) => {
      if (key === "avatar") {
        return `<img slot="${key}" src="${value}" alt="User Avatar" />`;
      } else if (Array.isArray(value)) {
        return `<ul slot="${key}">${value.map(item => `<li>${item}</li>`).join('')}</ul>`;
      } else {
        return `<span slot="${key}">${value}</span>`;
      }
    };

    this.shadowRoot.querySelector("section").innerHTML += entries.map(slot).join("\n");
  }
}

customElements.define("profile-view", ProfileViewElement);
