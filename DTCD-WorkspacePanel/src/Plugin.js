import pluginMeta from './Plugin.Meta';
import WorkspacePanelComponent from './components/WorkspacePanel.vue';

import {
  AppPanelPlugin,
  InteractionSystemAdapter,
  EventSystemAdapter,
  RouteSystemAdapter,
  LogSystemAdapter,
} from './../../DTCD-SDK/index';

export class WorkspacePanel extends AppPanelPlugin {
  #vueComponent;
  #logSystem;
  #eventSystem;

  #config = {
    elementSize: 'medium',
  };

  static getRegistrationMeta() {
    return pluginMeta;
  }

  constructor(guid, selector) {
    super();

    const eventSystem = new EventSystemAdapter('0.4.0', guid);
    this.#eventSystem = eventSystem;

    this.#eventSystem.registerPluginInstance(this, ['WorkspaceDeleted']);

    const interactionSystem = new InteractionSystemAdapter('0.4.0');
    const keycloak = this.getDependence('keycloak');

    const router = new RouteSystemAdapter('0.4.0');
    this.#logSystem = new LogSystemAdapter('0.5.0', guid, pluginMeta.name);

    const { default: VueJS } = this.getDependence('Vue');

    const data = {
      guid,
      interactionSystem,
      eventSystem,
      keycloak,
      plugin: this,
      router,
      logSystem: this.#logSystem,
      notificationSystem: Application.autocomplete.NotificationSystem,
    };

    const panel = new VueJS({
      data: () => data,
      render: h => h(WorkspacePanelComponent),
    }).$mount(selector);

    this.#vueComponent = panel.$children[0];
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
      const disabledAttrEditBtn = permissions['dtcd_workspaces.update'] ? {} : { disabled: true };
      const disabledAttrDelBtn = permissions['dtcd_workspaces.delete'] ? {} : { disabled: true };
      const disabledAttrExpoBtn = permissions['dtcd_workspaces.read'] ? {} : { disabled: true };

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
              callback: permissions['dtcd_workspaces.update']
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
              callback: permissions['dtcd_workspaces.delete']
                ? async () => {
                    const elemType = selectedElement.is_dir ? 'папку' : 'рабочий стол';
                    const isDelete = confirm(`Удалить ${elemType} "${selectedElement.title}"?`);
                    if (isDelete) {
                      await this.#vueComponent.deleteElement(selectedElement);
                      this.#eventSystem.publishEvent('WorkspaceDeleted', { guid: this.guid });
                      this.#vueComponent.selectWorkspaceElement(null);
                    }
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
            callback: permissions['dtcd_workspaces.read']
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
