import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent.vue';

import {
  AppPanelPlugin,
  InteractionSystemAdapter,
  EventSystemAdapter,
  WorkspaceSystemAdapter,
  RouteSystemAdapter,
  LogSystemAdapter,
} from './../../DTCD-SDK/index';

export class WorkspacePanel extends AppPanelPlugin {
  #vueComponent;
  #logSystem;

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
    this.#logSystem = new LogSystemAdapter('0.5.0', guid, pluginMeta.name);

    const { default: VueJS } = this.getDependence('Vue');

    const data = {
      guid,
      interactionSystem,
      eventSystem,
      workspaceSystem,
      plugin: this,
      router,
      logSystem: this.#logSystem,
    };

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
    const { permissions } = selectedElement;

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
        component: 'divider',
      },
    ];

    if (!selectedElement) {
      fields.push({
        component: 'subtitle',
        innerText: 'Выберете один из элементов рабочего стола',
      });
    } else {
      const disabledAttrEditBtn = permissions.update ? {} : { disabled: true };
      const disabledAttrDelBtn = permissions.delete ? {} : { disabled: true };
      const disabledAttrExpoBtn = permissions.read ? {} : { disabled: true };

      fields.push(
        ...[
          {
            component: 'title',
            innerText: `Выбран: ${selectedElement.title}`,
          },
          {
            component: 'button',
            innerText: 'Изменить элемент',
            panelRow: 'row2',
            column: '50',
            attrs: {
              theme: 'theme_blueSec',
              width: 'full',
              size: 'small',
              ...disabledAttrEditBtn,
            },
            handler: {
              event: 'click',
              callback: permissions.update
                ? () => {
                  this.#vueComponent.editElement(selectedElement);
                }
                : undefined,
            },
          },
          {
            component: 'button',
            innerText: 'Удалить элемент',
            panelRow: 'row2',
            column: '50',
            attrs: {
              theme: 'theme_red',
              width: 'full',
              size: 'small',
              ...disabledAttrDelBtn,
            },
            handler: {
              event: 'click',
              callback: permissions.delete
                ? () => {
                  const elemType = selectedElement.is_dir ? 'папку' : 'дашборд';
                  const isDelete = confirm(`Удалить ${elemType} "${selectedElement.title}"?`);
                  isDelete && this.#vueComponent.deleteElement(selectedElement);
                }
                : undefined,
            },
          },
        ]
      );

      if (!selectedElement.is_dir) {
        fields.push({
          component: 'button',
          innerText: 'Экспортировать элемент',
          attrs: {
            theme: 'theme_blueSec',
            width: 'full',
            size: 'small',
            ...disabledAttrExpoBtn,
          },
          handler: {
            event: 'click',
            callback: permissions.read
              ? () => {
                this.#vueComponent.exportConfiguration(selectedElement);
              }
              : undefined,
          },
        });
      }
    }
    return { fields };
  }
}
