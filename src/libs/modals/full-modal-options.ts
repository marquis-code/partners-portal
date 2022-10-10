export interface ModalOptions {
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  description: string;
  buttonText: string;
  clickCallBack?: () => unknown;
}
