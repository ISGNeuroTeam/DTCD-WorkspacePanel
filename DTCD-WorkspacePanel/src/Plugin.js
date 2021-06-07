import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent.vue';

import {
  PanelPlugin,
  InteractionSystemAdapter,
  EventSystemAdapter,
  WorkspaceSystemAdapter,
} from './../../DTCD-SDK/index';

export class Plugin extends PanelPlugin {
  static getRegistrationMeta() {
    return pluginMeta;
  }
  constructor(guid, selector) {
    super();
    const eventSystem = new EventSystemAdapter();
    const interactionSystem = new InteractionSystemAdapter();
    const workspaceSystem = new WorkspaceSystemAdapter();

    const VueJS = this.getDependence('Vue');

    const data = { guid, interactionSystem, eventSystem, workspaceSystem };

    new VueJS.default({
      data: () => data,
      render: h => h(PluginComponent),
    }).$mount(selector);
  }

  beforeDelete() {
    console.log('Deleting extensions...');
  }
}
