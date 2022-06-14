import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent.vue';

import {
  PanelPlugin,
  InteractionSystemAdapter,
  EventSystemAdapter,
  WorkspaceSystemAdapter,
  RouteSystemAdapter,
} from './../../DTCD-SDK/index';

export class WorkspacePanel extends PanelPlugin {

  #vueComponent;

  #config = {
    elementSize: 'medium',
  };

  static getRegistrationMeta() {
    return pluginMeta;
  }

  constructor(guid, selector) {
    super();

    const eventSystem = new EventSystemAdapter('0.4.0', guid);
    const interactionSystem = new InteractionSystemAdapter('0.4.0');
    const workspaceSystem = new WorkspaceSystemAdapter('0.4.0');
    const router = new RouteSystemAdapter('0.1.0');

    const { default: VueJS } = this.getDependence('Vue');

    const data = { guid, interactionSystem, eventSystem, workspaceSystem, plugin: this, router };

    const panel = new VueJS({
      data: () => data,
      render: h => h(PluginComponent),
    }).$mount(selector);

    this.#vueComponent = panel.$children[0].$children[0];
  }

  setPluginConfig(config) {
    for (let prop in config) {
      if (this.#config.hasOwnProperty(prop)) {
        this.#config[prop] = config[prop];
        if (this.#vueComponent.hasOwnProperty(prop)) {
          this.#vueComponent[prop] = config[prop];
        }
      }
    }
  }

  getPluginConfig() {
    return this.#config;
  }

  setFormSettings(config) {
    this.setPluginConfig(config);
  }

  getFormSettings() {
    const { selectedElement } = this.#vueComponent;

    const fields = [
      {
        component: 'title',
        innerText: 'Размер элементов',
      },
      {
        component: 'select',
        propName: 'elementSize',
        options: () => [
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' },
        ],
      },
      {
        component: 'title',
        innerText: 'Настройки элемента',
      },
    ];

    if (!selectedElement) {
      fields.push({
        component: 'subtitle',
        innerText: 'Выберете один из элементов рабочего стола',
      });
    } else {
      fields.push(...[
        {
          component: 'title',
          innerText: `Выбран: ${selectedElement.title}`,
        },
        {
          component: 'subtitle',
          innerText: 'Удалить элемент',
        },
        {
          component: 'button',
          innerText: 'Удалить',
          attrs: {
            theme: 'theme_red',
          },
          handler: {
            event: 'click',
            callback: () => {
              const isDelete = confirm(`Удалить дашборд "${selectedElement.title}"?`);
              isDelete && this.#vueComponent.deleteConfiguration(selectedElement.id);
            },
          }
        },
      ]);
    }
    return { fields };
  }
}
