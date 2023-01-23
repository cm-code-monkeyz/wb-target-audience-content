import CMElement from '@cm-code-monkeyz/cm-element';

customElements.define('wb-target-audience-content', class WBTargetAudienceContent extends CMElement {

  static COOKIENAME = "wb-target-audience";

  private _cookie: string;

  constructor() {
    super();
    this._useShadowRoot = true;
    this._cookie = (window as any).getCookie(WBTargetAudienceContent.COOKIENAME) || 'undefined';
  }

  static get observedAttributes() {
    return [...CMElement.observedAttributes];
  }

  public render = () => {
    return this.html`<div>
      ${this.slots.map(slot => 
        this.html`<slot style="display:${slot === this._cookie ? 'block' : 'none'}" name="${slot}" />`
      )}
    </div>`
  }

  public init = () => {
    this._onTargetAudienceChange();
    document.body.addEventListener('wb-target-audience-change', this._onTargetAudienceChange);
  }

  private _onTargetAudienceChange = () => {
    this._cookie = (window as any).getCookie(WBTargetAudienceContent.COOKIENAME) || 'undefined';
    if (this.slots.includes(this._cookie)) {
      this.setAttribute('data-active', 'true');
    } else {
      this.setAttribute('data-active', 'false');
    }
    this.renderNow();
  }

  public unload = () => {
    document.body.removeEventListener('wb-target-audience-change', this._onTargetAudienceChange);
  }

  private get slots(): string[] {
    const slotArray = ['undefined'];
    Array.from(this.children).forEach((node) => {
      const slotName = node.getAttribute('slot');
      if (!slotName) {
        node.setAttribute('slot', 'undefined');
      }
      if (!slotArray.includes(slotName)) {
        slotArray.push(slotName);
      }
    });
    return slotArray;
  }

});