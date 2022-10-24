/* eslint-disable */

import {App, createApp, h} from "vue";
import {ModalOptions} from "@/libs/modals/modal-options";
import ShFullModalComponent from "@/libs/modals/components/ShFullModalComponent.vue";
import './styles/sh-modal.scss';
export interface ShModal {
  open(modalOptions: ModalOptions): void;
  close(): void;
}

export class ShFullModal implements ShModal {
  private elementRef: Element | null = null;
  private modalApp!: App<Element>;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor () {
  }

  private cleanUp () {
    if (this.elementRef) {
      document.body.removeChild(this.elementRef);
    }
    const mainApp = document.getElementById('sh-vp-portal');
    if (mainApp) {
      mainApp.style.position = 'inherit';
      mainApp.style.opacity  = '1';
    }
  }

  private createElement (): Element {
    const modalEl: HTMLDivElement = document.createElement('div');
    const modalRef: string = `sh_modal_${Math.random()}`.slice(2);
    modalEl.setAttribute('id', modalRef);
    modalEl.setAttribute('class', 'sh-modal');
    const mainApp = document.getElementById('sh-vp-portal');
    if (mainApp) {
      mainApp.style.position = 'fixed';
      mainApp.style.opacity  = '0';
    }
    return modalEl;
  }

  open (options: ModalOptions): void {
    this.elementRef = this.createElement();
    document.body.appendChild(this.elementRef);
    const component = h(ShFullModalComponent, {
      options,
      onActionClicked: (e: any) => {
        // Review for extension in future update...for cases where action processes async call
        // this.close();
        options.clickCallBack?.call(e);
      }
    });
    this.modalApp = createApp(component);
    this.modalApp.mount(this.elementRef);
  }

  close (): void {
    if(this.modalApp){
      this.modalApp.unmount();
    }
    this.cleanUp();
  }
}
