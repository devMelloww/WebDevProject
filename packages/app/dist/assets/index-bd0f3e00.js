(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();var Qt;class Q extends Error{}Q.prototype.name="InvalidTokenError";function ys(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function $s(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return ys(t)}catch{return atob(t)}}function we(r,t){if(typeof r!="string")throw new Q("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new Q(`Invalid token specified: missing part #${e+1}`);let i;try{i=$s(s)}catch(o){throw new Q(`Invalid token specified: invalid base64 for part #${e+1} (${o.message})`)}try{return JSON.parse(i)}catch(o){throw new Q(`Invalid token specified: invalid json for part #${e+1} (${o.message})`)}}const vs="mu:context",Ht=`${vs}:change`;class bs{constructor(t,e){this._proxy=xs(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class As extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new bs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Ht,t),t}detach(t){this.removeEventListener(Ht,t)}}function xs(r,t){return new Proxy(r,{get:(s,i,o)=>{if(i==="then")return;const n=Reflect.get(s,i,o);return console.log(`Context['${i}'] => `,n),n},set:(s,i,o,n)=>{const h=r[i];console.log(`Context['${i.toString()}'] <= `,o);const a=Reflect.set(s,i,o,n);if(a){let p=new CustomEvent(Ht,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(p,{property:i,oldValue:h,value:o}),t.dispatchEvent(p)}else console.log(`Context['${i}] was not set to ${o}`);return a}})}function Es(r,t){const e=Se(t,r);return new Promise((s,i)=>{if(e){const o=e.localName;customElements.whenDefined(o).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function Se(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return Se(r,i.host)}class ws extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Pe(r="mu:message"){return(t,...e)=>t.dispatchEvent(new ws(e,r))}class Dt{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Ss(r){return t=>({...t,...r})}const Mt="mu:auth:jwt",ke=class Ce extends Dt{constructor(t,e){super((s,i)=>this.update(s,i),t,Ce.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(ks(s)),Tt(i);case"auth/signout":return e(Cs()),Tt(this._redirectForLogin);case"auth/redirect":return Tt(this._redirectForLogin,{next:window.location.href});default:const o=t[0];throw new Error(`Unhandled Auth message "${o}"`)}}};ke.EVENT_TYPE="auth:message";let Te=ke;const Oe=Pe(Te.EVENT_TYPE);function Tt(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,o])=>s.searchParams.set(i,o)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class Ps extends As{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:V.authenticateFromLocalStorage()})}connectedCallback(){new Te(this.context,this.redirect).attach(this)}}class it{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Mt),t}}class V extends it{constructor(t){super();const e=we(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new V(t);return localStorage.setItem(Mt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Mt);return t?V.authenticate(t):new it}}function ks(r){return Ss({user:V.authenticate(r),token:r})}function Cs(){return r=>{const t=r.user;return{user:t&&t.authenticated?it.deauthenticate(t):t,token:""}}}function Ts(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function Os(r){return r.authenticated?we(r.token||""):{}}const Re=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:V,Provider:Ps,User:it,dispatch:Oe,headers:Ts,payload:Os},Symbol.toStringTag,{value:"Module"}));function gt(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function It(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const Ue=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:It,relay:gt},Symbol.toStringTag,{value:"Module"})),Rs=new DOMParser;function ht(r,...t){const e=r.map((n,h)=>h?[t[h-1],n]:[n]).flat().join(""),s=Rs.parseFromString(e,"text/html"),i=s.head.childElementCount?s.head.children:s.body.children,o=new DocumentFragment;return o.replaceChildren(...i),o}function At(r){const t=r.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:s};function s(i,o={mode:"open"}){const n=i.attachShadow(o);return e&&n.appendChild(e.content.cloneNode(!0)),n}}const Us=class Ne extends HTMLElement{constructor(){super(),this._state={},At(Ne.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),gt(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},Ns(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};Us.template=ht`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Ns(r,t){const e=Object.entries(r);for(const[s,i]of e){const o=t.querySelector(`[name="${s}"]`);if(o){const n=o;switch(n.type){case"checkbox":const h=n;h.checked=!!i;break;case"date":n.value=i.toISOString().substr(0,10);break;default:n.value=i;break}}}return r}const Le=class He extends Dt{constructor(t){super((e,s)=>this.update(e,s),t,He.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(Hs(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(Ms(s,i));break}}}};Le.EVENT_TYPE="history:message";let Ls=Le;function Hs(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function Ms(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const Is=Pe(Ls.EVENT_TYPE);class _t{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Xt(this._provider,t);this._effects.push(i),e(i)}else Es(this._target,this._contextLabel).then(i=>{const o=new Xt(i,t);this._provider=i,this._effects.push(o),i.attach(n=>this._handleChange(n)),e(o)}).catch(i=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class Xt{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Me=class Ie extends HTMLElement{constructor(){super(),this._state={},this._user=new it,this._authObserver=new _t(this,"blazing:auth"),At(Ie.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;js(i,this._state,e,this.authorization).then(o=>K(o,this)).then(o=>{const n=`mu-rest-form:${s}`,h=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[s]:o,url:i}});this.dispatchEvent(h)}).catch(o=>{const n="mu-rest-form:error",h=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:o,url:i,request:this._state}});this.dispatchEvent(h)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},K(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&te(this.src,this.authorization).then(e=>{this._state=e,K(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&te(this.src,this.authorization).then(i=>{this._state=i,K(i,this)});break;case"new":s&&(this._state={},K({},this));break}}};Me.observedAttributes=["src","new","action"];Me.template=ht`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function te(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function K(r,t){const e=Object.entries(r);for(const[s,i]of e){const o=t.querySelector(`[name="${s}"]`);if(o){const n=o;switch(n.type){case"checkbox":const h=n;h.checked=!!i;break;default:n.value=i;break}}}return r}function js(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const zs=class je extends Dt{constructor(t,e){super(e,t,je.EVENT_TYPE,!1)}};zs.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ft=globalThis,Vt=ft.ShadowRoot&&(ft.ShadyCSS===void 0||ft.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ft=Symbol(),ee=new WeakMap;let ze=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Ft)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Vt&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=ee.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ee.set(e,t))}return t}toString(){return this.cssText}};const Ds=r=>new ze(typeof r=="string"?r:r+"",void 0,Ft),Vs=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new ze(e,r,Ft)},Fs=(r,t)=>{if(Vt)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=ft.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},se=Vt?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Ds(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Bs,defineProperty:qs,getOwnPropertyDescriptor:Ws,getOwnPropertyNames:Ys,getOwnPropertySymbols:Ks,getPrototypeOf:Js}=Object,F=globalThis,ie=F.trustedTypes,Zs=ie?ie.emptyScript:"",re=F.reactiveElementPolyfillSupport,X=(r,t)=>r,yt={toAttribute(r,t){switch(t){case Boolean:r=r?Zs:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Bt=(r,t)=>!Bs(r,t),ne={attribute:!0,type:String,converter:yt,reflect:!1,hasChanged:Bt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),F.litPropertyMetadata??(F.litPropertyMetadata=new WeakMap);let j=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ne){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&qs(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=Ws(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return i==null?void 0:i.call(this)},set(n){const h=i==null?void 0:i.call(this);o.call(this,n),this.requestUpdate(t,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ne}static _$Ei(){if(this.hasOwnProperty(X("elementProperties")))return;const t=Js(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(X("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(X("properties"))){const e=this.properties,s=[...Ys(e),...Ks(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(se(i))}else t!==void 0&&e.push(se(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Fs(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(o!==void 0&&i.reflect===!0){const n=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:yt).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,o=i._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const n=i.getPropertyOptions(o),h=typeof n.converter=="function"?{fromAttribute:n.converter}:((s=n.converter)==null?void 0:s.fromAttribute)!==void 0?n.converter:yt;this._$Em=o,this[o]=h.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??Bt)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[o,n]of i)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var o;return(o=i.hostUpdate)==null?void 0:o.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};j.elementStyles=[],j.shadowRootOptions={mode:"open"},j[X("elementProperties")]=new Map,j[X("finalized")]=new Map,re==null||re({ReactiveElement:j}),(F.reactiveElementVersions??(F.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $t=globalThis,vt=$t.trustedTypes,oe=vt?vt.createPolicy("lit-html",{createHTML:r=>r}):void 0,De="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,Ve="?"+w,Gs=`<${Ve}>`,N=document,rt=()=>N.createComment(""),nt=r=>r===null||typeof r!="object"&&typeof r!="function",Fe=Array.isArray,Qs=r=>Fe(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Ot=`[ 	
\f\r]`,J=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ae=/-->/g,le=/>/g,T=RegExp(`>|${Ot}(?:([^\\s"'>=/]+)(${Ot}*=${Ot}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),he=/'/g,ce=/"/g,Be=/^(?:script|style|textarea|title)$/i,Xs=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),Z=Xs(1),B=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),ue=new WeakMap,R=N.createTreeWalker(N,129);function qe(r,t){if(!Array.isArray(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return oe!==void 0?oe.createHTML(t):t}const ti=(r,t)=>{const e=r.length-1,s=[];let i,o=t===2?"<svg>":"",n=J;for(let h=0;h<e;h++){const a=r[h];let p,f,u=-1,l=0;for(;l<a.length&&(n.lastIndex=l,f=n.exec(a),f!==null);)l=n.lastIndex,n===J?f[1]==="!--"?n=ae:f[1]!==void 0?n=le:f[2]!==void 0?(Be.test(f[2])&&(i=RegExp("</"+f[2],"g")),n=T):f[3]!==void 0&&(n=T):n===T?f[0]===">"?(n=i??J,u=-1):f[1]===void 0?u=-2:(u=n.lastIndex-f[2].length,p=f[1],n=f[3]===void 0?T:f[3]==='"'?ce:he):n===ce||n===he?n=T:n===ae||n===le?n=J:(n=T,i=void 0);const c=n===T&&r[h+1].startsWith("/>")?" ":"";o+=n===J?a+Gs:u>=0?(s.push(p),a.slice(0,u)+De+a.slice(u)+w+c):a+w+(u===-2?h:c)}return[qe(r,o+(r[e]||"<?>")+(t===2?"</svg>":"")),s]};let jt=class We{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0;const h=t.length-1,a=this.parts,[p,f]=ti(t,e);if(this.el=We.createElement(p,s),R.currentNode=this.el.content,e===2){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=R.nextNode())!==null&&a.length<h;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(De)){const l=f[n++],c=i.getAttribute(u).split(w),d=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:d[2],strings:c,ctor:d[1]==="."?si:d[1]==="?"?ii:d[1]==="@"?ri:xt}),i.removeAttribute(u)}else u.startsWith(w)&&(a.push({type:6,index:o}),i.removeAttribute(u));if(Be.test(i.tagName)){const u=i.textContent.split(w),l=u.length-1;if(l>0){i.textContent=vt?vt.emptyScript:"";for(let c=0;c<l;c++)i.append(u[c],rt()),R.nextNode(),a.push({type:2,index:++o});i.append(u[l],rt())}}}else if(i.nodeType===8)if(i.data===Ve)a.push({type:2,index:o});else{let u=-1;for(;(u=i.data.indexOf(w,u+1))!==-1;)a.push({type:7,index:o}),u+=w.length-1}o++}}static createElement(t,e){const s=N.createElement("template");return s.innerHTML=t,s}};function q(r,t,e=r,s){var i,o;if(t===B)return t;let n=s!==void 0?(i=e._$Co)==null?void 0:i[s]:e._$Cl;const h=nt(t)?void 0:t._$litDirective$;return(n==null?void 0:n.constructor)!==h&&((o=n==null?void 0:n._$AO)==null||o.call(n,!1),h===void 0?n=void 0:(n=new h(r),n._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=n:e._$Cl=n),n!==void 0&&(t=q(r,n._$AS(r,t.values),n,s)),t}let ei=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??N).importNode(e,!0);R.currentNode=i;let o=R.nextNode(),n=0,h=0,a=s[0];for(;a!==void 0;){if(n===a.index){let p;a.type===2?p=new qt(o,o.nextSibling,this,t):a.type===1?p=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(p=new ni(o,this,t)),this._$AV.push(p),a=s[++h]}n!==(a==null?void 0:a.index)&&(o=R.nextNode(),n++)}return R.currentNode=N,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},qt=class Ye{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=q(this,t,e),nt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==B&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Qs(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==$&&nt(this._$AH)?this._$AA.nextSibling.data=t:this.T(N.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,o=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=jt.createElement(qe(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(s);else{const n=new ei(o,this),h=n.u(this.options);n.p(s),this.T(h),this._$AH=n}}_$AC(t){let e=ue.get(t.strings);return e===void 0&&ue.set(t.strings,e=new jt(t)),e}k(t){Fe(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new Ye(this.S(rt()),this.S(rt()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},xt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const o=this.strings;let n=!1;if(o===void 0)t=q(this,t,e,0),n=!nt(t)||t!==this._$AH&&t!==B,n&&(this._$AH=t);else{const h=t;let a,p;for(t=o[0],a=0;a<o.length-1;a++)p=q(this,h[s+a],e,a),p===B&&(p=this._$AH[a]),n||(n=!nt(p)||p!==this._$AH[a]),p===$?t=$:t!==$&&(t+=(p??"")+o[a+1]),this._$AH[a]=p}n&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},si=class extends xt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}},ii=class extends xt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}},ri=class extends xt{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=q(this,t,e,0)??$)===B)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},ni=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){q(this,t)}};const de=$t.litHtmlPolyfillSupport;de==null||de(jt,qt),($t.litHtmlVersions??($t.litHtmlVersions=[])).push("3.1.3");const oi=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new qt(t.insertBefore(rt(),o),o,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let D=class extends j{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=oi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return B}};D._$litElement$=!0,D.finalized=!0,(Qt=globalThis.litElementHydrateSupport)==null||Qt.call(globalThis,{LitElement:D});const pe=globalThis.litElementPolyfillSupport;pe==null||pe({LitElement:D});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ai={attribute:!0,type:String,converter:yt,reflect:!1,hasChanged:Bt},li=(r=ai,t,e)=>{const{kind:s,metadata:i}=e;let o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),o.set(e.name,r),s==="accessor"){const{name:n}=e;return{set(h){const a=t.get.call(this);t.set.call(this,h),this.requestUpdate(n,a,r)},init(h){return h!==void 0&&this.P(n,void 0,r),h}}}if(s==="setter"){const{name:n}=e;return function(h){const a=this[n];t.call(this,h),this.requestUpdate(n,a,r)}}throw Error("Unsupported decorator location: "+s)};function Ke(r){return(t,e)=>typeof e=="object"?li(r,t,e):((s,i,o)=>{const n=i.hasOwnProperty(o);return i.constructor.createProperty(o,n?{...s,wrapped:!0}:s),n?Object.getOwnPropertyDescriptor(i,o):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Je(r){return Ke({...r,state:!0,attribute:!1})}function hi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function ci(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ze={};(function(r){var t=function(){var e=function(u,l,c,d){for(c=c||{},d=u.length;d--;c[u[d]]=l);return c},s=[1,9],i=[1,10],o=[1,11],n=[1,12],h=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(l,c,d,g,m,_,wt){var A=_.length-1;switch(m){case 1:return new g.Root({},[_[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[_[A-1],_[A]]);break;case 4:case 5:this.$=_[A];break;case 6:this.$=new g.Literal({value:_[A]});break;case 7:this.$=new g.Splat({name:_[A]});break;case 8:this.$=new g.Param({name:_[A]});break;case 9:this.$=new g.Optional({},[_[A-1]]);break;case 10:this.$=l;break;case 11:case 12:this.$=l.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:o,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:o,15:n},{1:[2,2]},e(h,[2,4]),e(h,[2,5]),e(h,[2,6]),e(h,[2,7]),e(h,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:o,15:n},e(h,[2,10]),e(h,[2,11]),e(h,[2,12]),{1:[2,1]},e(h,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:o,15:n},e(h,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(l,c){if(c.recoverable)this.trace(l);else{let d=function(g,m){this.message=g,this.hash=m};throw d.prototype=Error,new d(l,c)}},parse:function(l){var c=this,d=[0],g=[null],m=[],_=this.table,wt="",A=0,Jt=0,fs=2,Zt=1,ms=m.slice.call(arguments,1),y=Object.create(this.lexer),k={yy:{}};for(var St in this.yy)Object.prototype.hasOwnProperty.call(this.yy,St)&&(k.yy[St]=this.yy[St]);y.setInput(l,k.yy),k.yy.lexer=y,k.yy.parser=this,typeof y.yylloc>"u"&&(y.yylloc={});var Pt=y.yylloc;m.push(Pt);var gs=y.options&&y.options.ranges;typeof k.yy.parseError=="function"?this.parseError=k.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var _s=function(){var M;return M=y.lex()||Zt,typeof M!="number"&&(M=c.symbols_[M]||M),M},b,C,x,kt,H={},dt,E,Gt,pt;;){if(C=d[d.length-1],this.defaultActions[C]?x=this.defaultActions[C]:((b===null||typeof b>"u")&&(b=_s()),x=_[C]&&_[C][b]),typeof x>"u"||!x.length||!x[0]){var Ct="";pt=[];for(dt in _[C])this.terminals_[dt]&&dt>fs&&pt.push("'"+this.terminals_[dt]+"'");y.showPosition?Ct="Parse error on line "+(A+1)+`:
`+y.showPosition()+`
Expecting `+pt.join(", ")+", got '"+(this.terminals_[b]||b)+"'":Ct="Parse error on line "+(A+1)+": Unexpected "+(b==Zt?"end of input":"'"+(this.terminals_[b]||b)+"'"),this.parseError(Ct,{text:y.match,token:this.terminals_[b]||b,line:y.yylineno,loc:Pt,expected:pt})}if(x[0]instanceof Array&&x.length>1)throw new Error("Parse Error: multiple actions possible at state: "+C+", token: "+b);switch(x[0]){case 1:d.push(b),g.push(y.yytext),m.push(y.yylloc),d.push(x[1]),b=null,Jt=y.yyleng,wt=y.yytext,A=y.yylineno,Pt=y.yylloc;break;case 2:if(E=this.productions_[x[1]][1],H.$=g[g.length-E],H._$={first_line:m[m.length-(E||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(E||1)].first_column,last_column:m[m.length-1].last_column},gs&&(H._$.range=[m[m.length-(E||1)].range[0],m[m.length-1].range[1]]),kt=this.performAction.apply(H,[wt,Jt,A,k.yy,x[1],g,m].concat(ms)),typeof kt<"u")return kt;E&&(d=d.slice(0,-1*E*2),g=g.slice(0,-1*E),m=m.slice(0,-1*E)),d.push(this.productions_[x[1]][0]),g.push(H.$),m.push(H._$),Gt=_[d[d.length-2]][d[d.length-1]],d.push(Gt);break;case 3:return!0}}return!0}},p=function(){var u={EOF:1,parseError:function(c,d){if(this.yy.parser)this.yy.parser.parseError(c,d);else throw new Error(c)},setInput:function(l,c){return this.yy=c||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var c=l.match(/(?:\r\n?|\n).*/g);return c?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},unput:function(l){var c=l.length,d=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-c),this.offset-=c;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),d.length-1&&(this.yylineno-=d.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:d?(d.length===g.length?this.yylloc.first_column:0)+g[g.length-d.length].length-d[0].length:this.yylloc.first_column-c},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-c]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(l){this.unput(this.match.slice(l))},pastInput:function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var l=this.pastInput(),c=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+c+"^"},test_match:function(l,c){var d,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=l[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],d=this.performAction.call(this,this.yy,this,c,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),d)return d;if(this._backtrack){for(var _ in m)this[_]=m[_];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,c,d,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),_=0;_<m.length;_++)if(d=this._input.match(this.rules[m[_]]),d&&(!c||d[0].length>c[0].length)){if(c=d,g=_,this.options.backtrack_lexer){if(l=this.test_match(d,m[_]),l!==!1)return l;if(this._backtrack){c=!1;continue}else return!1}else if(!this.options.flex)break}return c?(l=this.test_match(c,m[g]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var c=this.next();return c||this.lex()},begin:function(c){this.conditionStack.push(c)},popState:function(){var c=this.conditionStack.length-1;return c>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(c){return c=this.conditionStack.length-1-Math.abs(c||0),c>=0?this.conditionStack[c]:"INITIAL"},pushState:function(c){this.begin(c)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(c,d,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=p;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof ci<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Ze);function I(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var Ge={Root:I("Root"),Concat:I("Concat"),Literal:I("Literal"),Splat:I("Splat"),Param:I("Param"),Optional:I("Optional")},Qe=Ze.parser;Qe.yy=Ge;var ui=Qe,di=Object.keys(Ge);function pi(r){return di.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Xe=pi,fi=Xe,mi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function ts(r){this.captures=r.captures,this.re=r.re}ts.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var gi=fi({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(mi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new ts({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),_i=gi,yi=Xe,$i=yi({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),vi=$i,bi=ui,Ai=_i,xi=vi;ct.prototype=Object.create(null);ct.prototype.match=function(r){var t=Ai.visit(this.ast),e=t.match(r);return e||!1};ct.prototype.reverse=function(r){return xi.visit(this.ast,r)};function ct(r){var t;if(this?t=this:t=Object.create(ct.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=bi.parse(r),t}var Ei=ct,wi=Ei,Si=wi;const Pi=hi(Si);var ki=Object.defineProperty,Ci=Object.getOwnPropertyDescriptor,es=(r,t,e,s)=>{for(var i=s>1?void 0:s?Ci(t,e):t,o=r.length-1,n;o>=0;o--)(n=r[o])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&ki(t,e,i),i};class Wt extends D{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>Z`
      <h1>Not Found</h1>
    `,this._cases=t.map(i=>({...i,route:new Pi(i.path)})),this._historyObserver=new _t(this,e),this._authObserver=new _t(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),Z`
      <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(Oe(this,"auth/redirect"),Z`
              <h1>Redirecting for Login</h1>
            `):e.view(e.params||{}):Z`
              <h1>Authenticating</h1>
            `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),Z`
              <h1>Redirecting to ${s}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),o=s+e;for(const n of this._cases){const h=n.route.match(o);if(h)return{...n,path:s,params:h,query:i}}}redirect(t){Is(this,"history/redirect",{href:t})}}Wt.styles=Vs`
    :host,
    main {
      display: contents;
    }
  `;es([Je()],Wt.prototype,"_user",2);es([Je()],Wt.prototype,"_match",2);const Ti=class ss extends HTMLElement{constructor(){if(super(),At(ss.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Ti.template=ht`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Oi=class is extends HTMLElement{constructor(){super(),this._array=[],At(is.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(rs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,o=e.closest("label");if(o){const n=Array.from(this.children).indexOf(o);this._array[n]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{It(t,"button.add")?gt(t,"input-array:add"):It(t,"button.remove")&&gt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Ri(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Oi.template=ht`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style>
          :host {
            display: contents;
          }
          ul {
            display: contents;
          }
          button.add {
            grid-column: input / input-end;
          }
          ::slotted(label) {
            display: contents;
          }
        </style>
      </button>
    </template>
  `;function Ri(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(rs(e)))}function rs(r,t){const e=r===void 0?"":`value="${r}"`;return ht`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function ns(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Ui=Object.defineProperty,Ni=Object.getOwnPropertyDescriptor,Li=(r,t,e,s)=>{for(var i=s>1?void 0:s?Ni(t,e):t,o=r.length-1,n;o>=0;o--)(n=r[o])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&Ui(t,e,i),i};class Hi extends D{constructor(t){super(),this._pending=[],this._observer=new _t(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}Li([Ke()],Hi.prototype,"model",1);ns({"mu-auth":Re.Provider});/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt=globalThis,Yt=mt.ShadowRoot&&(mt.ShadyCSS===void 0||mt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Kt=Symbol(),fe=new WeakMap;let os=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Kt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Yt&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=fe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&fe.set(e,t))}return t}toString(){return this.cssText}};const Mi=r=>new os(typeof r=="string"?r:r+"",void 0,Kt),Ii=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new os(e,r,Kt)},ji=(r,t)=>{if(Yt)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=mt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},me=Yt?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Mi(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:zi,defineProperty:Di,getOwnPropertyDescriptor:Vi,getOwnPropertyNames:Fi,getOwnPropertySymbols:Bi,getPrototypeOf:qi}=Object,P=globalThis,ge=P.trustedTypes,Wi=ge?ge.emptyScript:"",Rt=P.reactiveElementPolyfillSupport,tt=(r,t)=>r,zt={toAttribute(r,t){switch(t){case Boolean:r=r?Wi:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},as=(r,t)=>!zi(r,t),_e={attribute:!0,type:String,converter:zt,reflect:!1,hasChanged:as};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),P.litPropertyMetadata??(P.litPropertyMetadata=new WeakMap);class z extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_e){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Di(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=Vi(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return i==null?void 0:i.call(this)},set(n){const h=i==null?void 0:i.call(this);o.call(this,n),this.requestUpdate(t,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_e}static _$Ei(){if(this.hasOwnProperty(tt("elementProperties")))return;const t=qi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(tt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(tt("properties"))){const e=this.properties,s=[...Fi(e),...Bi(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(me(i))}else t!==void 0&&e.push(me(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ji(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var o;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const n=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:zt).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){var o;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const n=s.getPropertyOptions(i),h=typeof n.converter=="function"?{fromAttribute:n.converter}:((o=n.converter)==null?void 0:o.fromAttribute)!==void 0?n.converter:zt;this._$Em=i,this[i]=h.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??as)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[o,n]of i)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var o;return(o=i.hostUpdate)==null?void 0:o.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}z.elementStyles=[],z.shadowRootOptions={mode:"open"},z[tt("elementProperties")]=new Map,z[tt("finalized")]=new Map,Rt==null||Rt({ReactiveElement:z}),(P.reactiveElementVersions??(P.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const et=globalThis,bt=et.trustedTypes,ye=bt?bt.createPolicy("lit-html",{createHTML:r=>r}):void 0,ls="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,hs="?"+S,Yi=`<${hs}>`,L=document,ot=()=>L.createComment(""),at=r=>r===null||typeof r!="object"&&typeof r!="function",cs=Array.isArray,Ki=r=>cs(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Ut=`[ 	
\f\r]`,G=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$e=/-->/g,ve=/>/g,O=RegExp(`>|${Ut}(?:([^\\s"'>=/]+)(${Ut}*=${Ut}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),be=/'/g,Ae=/"/g,us=/^(?:script|style|textarea|title)$/i,Ji=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),Zi=Ji(1),W=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),xe=new WeakMap,U=L.createTreeWalker(L,129);function ds(r,t){if(!Array.isArray(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ye!==void 0?ye.createHTML(t):t}const Gi=(r,t)=>{const e=r.length-1,s=[];let i,o=t===2?"<svg>":"",n=G;for(let h=0;h<e;h++){const a=r[h];let p,f,u=-1,l=0;for(;l<a.length&&(n.lastIndex=l,f=n.exec(a),f!==null);)l=n.lastIndex,n===G?f[1]==="!--"?n=$e:f[1]!==void 0?n=ve:f[2]!==void 0?(us.test(f[2])&&(i=RegExp("</"+f[2],"g")),n=O):f[3]!==void 0&&(n=O):n===O?f[0]===">"?(n=i??G,u=-1):f[1]===void 0?u=-2:(u=n.lastIndex-f[2].length,p=f[1],n=f[3]===void 0?O:f[3]==='"'?Ae:be):n===Ae||n===be?n=O:n===$e||n===ve?n=G:(n=O,i=void 0);const c=n===O&&r[h+1].startsWith("/>")?" ":"";o+=n===G?a+Yi:u>=0?(s.push(p),a.slice(0,u)+ls+a.slice(u)+S+c):a+S+(u===-2?h:c)}return[ds(r,o+(r[e]||"<?>")+(t===2?"</svg>":"")),s]};class lt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0;const h=t.length-1,a=this.parts,[p,f]=Gi(t,e);if(this.el=lt.createElement(p,s),U.currentNode=this.el.content,e===2){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=U.nextNode())!==null&&a.length<h;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(ls)){const l=f[n++],c=i.getAttribute(u).split(S),d=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:d[2],strings:c,ctor:d[1]==="."?Xi:d[1]==="?"?tr:d[1]==="@"?er:Et}),i.removeAttribute(u)}else u.startsWith(S)&&(a.push({type:6,index:o}),i.removeAttribute(u));if(us.test(i.tagName)){const u=i.textContent.split(S),l=u.length-1;if(l>0){i.textContent=bt?bt.emptyScript:"";for(let c=0;c<l;c++)i.append(u[c],ot()),U.nextNode(),a.push({type:2,index:++o});i.append(u[l],ot())}}}else if(i.nodeType===8)if(i.data===hs)a.push({type:2,index:o});else{let u=-1;for(;(u=i.data.indexOf(S,u+1))!==-1;)a.push({type:7,index:o}),u+=S.length-1}o++}}static createElement(t,e){const s=L.createElement("template");return s.innerHTML=t,s}}function Y(r,t,e=r,s){var n,h;if(t===W)return t;let i=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl;const o=at(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==o&&((h=i==null?void 0:i._$AO)==null||h.call(i,!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=Y(r,i._$AS(r,t.values),i,s)),t}class Qi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??L).importNode(e,!0);U.currentNode=i;let o=U.nextNode(),n=0,h=0,a=s[0];for(;a!==void 0;){if(n===a.index){let p;a.type===2?p=new ut(o,o.nextSibling,this,t):a.type===1?p=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(p=new sr(o,this,t)),this._$AV.push(p),a=s[++h]}n!==(a==null?void 0:a.index)&&(o=U.nextNode(),n++)}return U.currentNode=L,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class ut{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),at(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==W&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ki(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==v&&at(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){var o;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=lt.createElement(ds(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===i)this._$AH.p(e);else{const n=new Qi(i,this),h=n.u(this.options);n.p(e),this.T(h),this._$AH=n}}_$AC(t){let e=xe.get(t.strings);return e===void 0&&xe.set(t.strings,e=new lt(t)),e}k(t){cs(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new ut(this.S(ot()),this.S(ot()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(t,e=this,s,i){const o=this.strings;let n=!1;if(o===void 0)t=Y(this,t,e,0),n=!at(t)||t!==this._$AH&&t!==W,n&&(this._$AH=t);else{const h=t;let a,p;for(t=o[0],a=0;a<o.length-1;a++)p=Y(this,h[s+a],e,a),p===W&&(p=this._$AH[a]),n||(n=!at(p)||p!==this._$AH[a]),p===v?t=v:t!==v&&(t+=(p??"")+o[a+1]),this._$AH[a]=p}n&&!i&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Xi extends Et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}}class tr extends Et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==v)}}class er extends Et{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??v)===W)return;const s=this._$AH,i=t===v&&s!==v||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==v&&(s===v||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class sr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const Nt=et.litHtmlPolyfillSupport;Nt==null||Nt(lt,ut),(et.litHtmlVersions??(et.litHtmlVersions=[])).push("3.1.4");const ir=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new ut(t.insertBefore(ot(),o),o,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class st extends z{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ir(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return W}}var Ee;st._$litElement$=!0,st.finalized=!0,(Ee=globalThis.litElementHydrateSupport)==null||Ee.call(globalThis,{LitElement:st});const Lt=globalThis.litElementPolyfillSupport;Lt==null||Lt({LitElement:st});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.6");class ps extends st{render(){return Zi`
      <header>
        <!-- TODO: insert contents of header here -->
        <nav class="w3-bar w3-black">
          <a href="#home" class="w3-button w3-bar-item">Home</a>
          <a href="./pages/countries.html" class="w3-button w3-bar-item"
            >countries</a
          >
          <a href="./pages/contact.html" class="w3-button w3-bar-item"
            >Contact</a
          >
        </nav>
      </header>

      <label @change=${rr}>
    <input type="checkbox" autocomplete="off" />
    Dark mode
  </label>
    `}}ps.styles=Ii`
    /* TODO: Style the header here */
    * {
    font-family: "Protest Riot", sans-serif;
    margin: 0;
    padding: 0;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
  /* CSS for Navbar */
  
  .w3-bar {
    width: 100%;
    overflow: hidden;
    background-color: #28282b;
  }
  
  .w3-bar a {
    float: left;
    display: block;
    color: #ff6347;
    text-align: center;
    padding: 14px 20px;
    text-decoration: none;
  }
  
  .w3-bar a:hover {
    background-color: #ff6347;
    color: white;
  }
  
  .section-content {
    position: relative;
  }
  
  .intro-msg {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 800px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 40px;
    font-size: 25px;
    color: #e5e4e2;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    border-radius: 15px;
    box-shadow: 5px 10px rgba(255, 255, 255, 0.5);
    border: 4px solid white;
    transition: top 0.3s;
  }
  
  .intro-msg:hover {
    border-color: #ff6347;
    box-shadow: 5px 10px rgba(255, 99, 71, 0.5);
  }
  
  .intro-msg.fixed {
    position: fixed;
    margin-top: 0;
    top: 10px; /* Adjust as needed */
  }
  
  .w3-row-padding {
    display: flex;
    flex-wrap: wrap;
  }
  
  .flex-container {
    display: flex;
  }
  
  .flex-container img {
    flex: 1;
    border-radius: 90px;
  }
  
  .info-container p {
    color: #343434;
    flex: 1;
    padding: 20px;
    font-size: 20px;
    margin: 20px;
    font-family: "Caveat", cursive;
  }
  
  .info-container {
    display: flex;
    flex-direction: column;
    align-items: center; /* Align items (including the button) to the center horizontally */
    text-align: center; /* Align text inside the div to the center */
  }
  
  .info-container button {
    margin: -10px 0px 20px 0px; /* Add some space between the paragraphs and the button */
    width: 200px;
    height: 50px;
    border-radius: 10px;
    background-color: #ff6347;
    color: white;
    border: 2px solid black;
  }
  
  .info-container button:hover {
    border: 3px solid black;
  }
  
  
  .flex-container h1 {
    color: #1b1212;
    padding: 20px;
    margin: 50px 20px -20px 20px;
    text-align: center;
    font-size: 50px;
  }
  
  .flex-container h2 {
    color: #1b1212;
    padding: 10px;
    text-align: center;
    margin: 0px 20px 20px 20px;
  }
  
  .w3-third {
    background-color: #f0ffff;
    width: 100%;
  }
  
  .pt {
    border-top: 5px solid black;
  }
  
  .w3-third img {
    width: 50%;
    padding: 50px 20px 50px 50px;
  }
  
  .w3-container {
    margin: -5px 0px 0px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30vh; /* Set height to 100% of the viewport height */
  }
  
  .w3-container p {
    margin: 0; /* Remove the default margin */
    text-align: center;
    font-size: 30px;
    color: #e5aa70;
  }
  
  .img-b {
    background-image: url("../images/banner.jpg");
    background-size: cover;
    background-position: center;
    height: 50vh; /* Set the height to fill the viewport height */
  }
  
  .flex-container2 {
    display: flex;
    flex-direction: row-reverse; /* Reverse the order of the flex items */
    background-color: #A7C7E7;
    border-bottom: 5px solid black;
    border-top: 5px solid black;
  }
  
  .flex-container2 img {
    flex: 1;
    max-width: 100%; /* Ensure the image doesn't exceed the container width */
    margin-left: 20px; /* Add some space between the image and text */
    border-radius: 90px;
  }
  
  .flex-container2 div {
    flex: 1;
  }
  
  .flex-container2 h1 {
    color: #1b1212;
    padding: 20px;
    margin: 50px 20px -20px 20px;
    text-align: center;
    font-size: 50px;
  }
  
  .flex-container2 h2 {
    color: #1b1212;
    padding: 10px;
    text-align: center;
    margin: 0px 20px 20px 20px;
  }
  
  .flex-container2 p {
    color: #36454F;
    flex: 1;
    padding: 20px;
    font-size: 20px;
    margin: 20px;
    font-family: "Caveat", cursive;
    font-optical-sizing: auto;
  }
  
  /* Footer */
  footer {
    background-color: #28282b; /* Black background color */
    color: white; /* White text color */
    padding: 20px; /* Padding inside the footer */
    text-align: center; /* Center-align text */
    font-size: 18px; /* Font size for text */
  }
  
  .fl3 {
      background-color: #FFF5EE;
  }
  
  
  .flags {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          padding: 20px;
      }
      .flag {
          width: 100px;
          height: 60px;
          margin: 10px;
          background-size: contain;
          background-repeat: no-repeat;
      }
      .flag.flag-us {
          background-image: url('https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg');
      }
      .flag.flag-uk {
          background-image: url('https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg');
      }
      .flag.flag-fr {
          background-image: url('../images/flags/Englang.png');
      }
  
  .fl {
    background-color: #343434;
    align-items: center;
    display: flex;
    flex-direction: column;
  }
  
  .fl button{
    margin: -10px 0px 20px 0px; /* Add some space between the paragraphs and the button */
    width: 100px;
    height: 40px;
    border-radius: 10px;
    background-color: #ff6347;
    color: white;
    border: 2px solid black;
  }
  
  .fl a{
    color: white;
    text-decoration: none;;
  }
  
  .fl h2 {
    margin: 10px;
    color: white;
  
  }  
  `;function rr(r){const e=r.target.checked;Ue.relay(r,"dark-mode",{checked:e})}ns({"mu-auth":Re.Provider,"blazing-header":ps});window.relayEvent=Ue.relay;
