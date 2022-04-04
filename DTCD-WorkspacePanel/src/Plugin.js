import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent.vue';

import {
  PanelPlugin,
  StyleSystemAdapter,
  InteractionSystemAdapter,
  EventSystemAdapter,
  WorkspaceSystemAdapter,
  RouteSystemAdapter,
} from './../../DTCD-SDK/index';

export class Plugin extends PanelPlugin {
  static getRegistrationMeta() {
    return pluginMeta;
  }

  constructor(guid, selector) {
    super();
    const eventSystem = new EventSystemAdapter('0.4.0', guid);
    const styleSystem = new StyleSystemAdapter('0.4.0');
    const interactionSystem = new InteractionSystemAdapter('0.4.0');
    const workspaceSystem = new WorkspaceSystemAdapter('0.4.0');
    const router = new RouteSystemAdapter('0.1.0');

    const VueJS = this.getDependence('Vue');

    const data = { guid, interactionSystem, eventSystem, workspaceSystem, plugin: this, router };

    const panel = new VueJS.default({
      data: () => data,
      render: h => h(PluginComponent),
    }).$mount(selector);

    styleSystem.setVariablesToElement(panel.$el, styleSystem.getCurrentTheme());
  }

  beforeDelete() {
    console.log('Deleting extensions...');
  }
}
