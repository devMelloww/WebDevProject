// src/views/tour-view.ts
import { define, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property } from "lit/decorators.js";
import { Tour } from "../server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class TourViewElement extends View<Model, Msg> {
  @property({ attribute: "tour-id", reflect: true })
  tourid = "";

  @property()
  get tour(): Tour | undefined {
    return this.model.tour;
  }

  constructor() {
    super("blazing:model");
  }

  render() {
    return html`
      <div>
        <h1>Tour Details</h1>
        ${this.tour
          ? html`
              <p>Name: ${this.tour.name}</p>
              <p>Description: ${this.tour.description}</p>
            `
          : html`<p>Loading...</p>`}
      </div>
    `;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "tour-id" && oldValue !== newValue && newValue) {
      this.dispatchMessage(["tour/select", { tourid: newValue }]);
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }
}

customElements.define("tour-view", TourViewElement);
