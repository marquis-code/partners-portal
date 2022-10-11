import ToastPlugin from 'vue-toast-notification';
import ShModalPlugin from '@/plugins/sh-modal';
import {App, Plugin} from "@vue/runtime-core";
const PLUGINS: Array<Plugin> = [
  ToastPlugin,
  ShModalPlugin
];

class PluginService {
  constructor (private plugins: Array<Plugin>) {
  }

  registerPlugins (app: App<Element>) {
    this.plugins.forEach(plugin => {
      app.use(plugin);
    });
    return app;
  }
}
export default new PluginService(PLUGINS);
