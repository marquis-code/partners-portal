/* eslint-disable */

import {App, createApp, h} from "vue";
import {ModalOptions} from "@/libs/modals/full-modal-options";
import ShFullModalComponent from "@/libs/modals/ShFullModalComponent.vue";

export interface ShModal {
  open(modalOptions: ModalOptions): void;
  close(): void;
}

export class ShFullModal/* implements ShModal*/ {
  private elementRef: Element | null = null;
  private modalApp!: App<Element>;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor () {
  }

  private cleanUp () {
    if (this.elementRef) {
      document.body.removeChild(this.elementRef);
    }
  }

  private createElement (): Element {
    const modalEl: HTMLDivElement = document.createElement('div');
    const modalRef: string = `sh_modal_${Math.random()}`.slice(2, 8);
    modalEl.setAttribute('id', modalRef);
    return modalEl;
  }

  open (options: ModalOptions): void {
    this.elementRef = this.createElement();
    document.body.appendChild(this.elementRef);
    const component = h(ShFullModalComponent, {
      options,
      onCloseClicked: (e: any) => {
        console.log('Close clicked');
        this.close();
      }
    });
    this.modalApp = createApp(component);
    this.modalApp.mount(this.elementRef);
  }

  close (): void {
    this.modalApp.unmount();
    this.cleanUp();
  }
}
