import ToastPlugin from 'vue-toast-notification';
import ShModalPlugin from '@/plugins/sh-modal';
import {App, Plugin} from "@vue/runtime-core";
import vSelect from "vue-select";

const PLUGINS: Array<Plugin> = [
  // ToastPlugin,
  ShModalPlugin
];

const COMPONENTS: Record<string, any> = {
  'v-select': vSelect
};

class PluginService {
  constructor (private plugins: Array<Plugin>, private components: Record<string, any>) {
  }

  registerPlugins (app: App<Element>) {
    app.use(ToastPlugin, {
      position: 'top'
    })
    this.plugins.forEach(plugin => {
      app.use(plugin);
    });
    Object.keys(this.components).forEach(key => {
      app.component(key, this.components[key]);
    });
    return app;
  }
}
export default new PluginService(PLUGINS, COMPONENTS);
