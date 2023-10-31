<template>
  <div class="workspace-panel" ref="panel" @click.self="selectWorkspaceElement(null)">
    <ModalWindow
      v-if="isModalVisible"
      :curPath="curPath"
      :editParams="editElemParams"
      @close="closeModal"
      @createElement="createElement"
      @editElement="editElementData"
      @importElement="importConfiguration"
    />

    <div class="breadcrumbs">
      <div class="breadcrumbs-item" @click="getElementList()">
        <div class="title">
          <span class="FontIcon name_homeOutline"></span>
        </div>
      </div>
      <div
        v-for="(item, i) in breadcrumbsItems"
        :key="`path-${i}`"
        class="breadcrumbs-item"
        @click="item.clickable && getElementList(item.path)"
      >
        <div class="title">
          <span v-if="item.clickable" v-text="item.title" />
          <span v-else class="FontIcon name_moreHorizontal"></span>
        </div>
      </div>
    </div>

    <div class="header">
      <base-input
        :value="search"
        class="search-field"
        size="big"
        type="search"
        placeholder="Поиск"
        @input="search = $event.target.value"
      >
        <span slot="icon-left" class="FontIcon name_searchSmall size_lg"></span>
      </base-input>

      <div class="action-panel">
        <base-dropdown>
          <span slot="icon-arrow"></span>
          <span slot="toggle-btn" class="toggle-btn">
            <span class="FontIcon name_filter size_lg"></span>
            <span class="title">Фильтры</span>
          </span>
          <nav class="dropdown-menu">
            <base-checkbox
              v-for="(filter, i) in filterList"
              :key="`filter-${i}`"
              :checked="filter.checked"
              @change="filter.checked = $event.target.value"
            >
              <span class="menu-item-title" v-text="filter.title" />
            </base-checkbox>
          </nav>
        </base-dropdown>

        <base-dropdown>
          <span slot="icon-arrow"></span>
          <span slot="toggle-btn" class="toggle-btn">
            <span class="FontIcon name_sort size_lg"></span>
            <span class="title">Сортировка:</span>
            <span class="subtitle" v-text="sortTitle" />
          </span>
          <nav class="dropdown-menu">
            <span
              v-for="(sort, i) in sortList"
              :key="`sort-${i}`"
              class="menu-item-title"
              :class="{ selected: sort.type === sortBy }"
              @click="sortBy = sort.type"
              v-text="sort.title"
            />
          </nav>
        </base-dropdown>
      </div>

      <base-button
        class="create-elem-btn"
        theme="theme_alfa"
        size="big"
        @click="openModal"
        :disabled="disabledCreateBtn"
      >
        <span slot="icon-left" class="FontIcon name_plusCircleOutline size_lg icon"></span>
        <span class="title">Добавить элемент</span>
      </base-button>
    </div>

    <div class="element-list-wrapper">
      <div v-if="elementsToShow.length < 1" class="element-list-placeholder">
        <span :class="['FontIcon icon', placeholderData.icon]"></span>
        <span class="title" v-text="placeholderData.title" />
      </div>
      <div class="element-list" :style="{ gridTemplateColumns }" @click.self="selectWorkspaceElement(null)">
        <div
          v-for="(elem, i) in elementsToShow"
          :key="`el_${i}`"
          :ref="`el_${i}`"
          :class="['list-item', !elem.permissions.read && 'disabled']"
          @click="selectWorkspaceElement(elem, `el_${i}`)"
          @dblclick="elem.permissions.read && openElem(elem)"
        >
          <WorkspaceElementIcon v-if="elem.is_dir" isFolder/>
          <WorkspaceElementIcon v-else :icon="elem.meta.icon" :colors="elem.meta.color" />
          <base-tooltip class="ElementTooltip" :content="elem.title" placement="bottom">
            <span class="title type_dashboard">{{ elem.title | truncate(20, '...') }}</span>
          </base-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModalWindow from '@/components/ModalWindow';
import WorkspaceElementIcon from '@/components/WorkspaceElementIcon';
import elementSizes from './../utils/elementSizes';

export default {
  name: 'WorkspacePanel',
  components: { ModalWindow, WorkspaceElementIcon },
  data: ({ $root }) => ({
    interactionSystem: $root.interactionSystem,
    logSystem: $root.logSystem,
    notificationSystem: $root.notificationSystem,
    keycloak: $root.keycloak,
    router: $root.router,
    endpoint: '/dtcd_workspaces/v1',
    isModalVisible: false,
    editElemParams: null,
    curPath: '',
    isLoading: false,
    sortBy: 'default',
    elementList: [],
    search: '',
    elementSize: 'medium',
    selectedElement: null,
    filterList: [
      { title: 'Папки', checked: true },
      { title: 'Дашборды', checked: true },
    ],
    sortList: [
      { title: 'По алфавиту', type: 'title' },
      { title: 'По дате создания', type: 'creation_time' },
      { title: 'По дате изменения', type: 'modification_time' },
    ],
    disabledCreateBtn: true,
  }),
  computed: {
    elementsToShow() {
      if (this.elementList.length <= 0) return [];

      const list = !this.search
        ? this.elementList
        : this.elementList.filter(el => el.title.toLowerCase().includes(this.search.toLowerCase()));

      if (this.sortList.map(s => s.type).includes(this.sortBy)) {
        list.sort((a, b) => {
          if (a[this.sortBy] > b[this.sortBy]) return 1;
          if (a[this.sortBy] < b[this.sortBy]) return -1;
          return 0;
        });
      }

      if (this.isAllFilterChecked) return list;

      const [folderFilter, dashFilter] = this.filterList.map(f => f.checked);

      if (folderFilter && !dashFilter) {
        return list.filter(el => el.is_dir === true);
      } else if (!folderFilter && dashFilter) {
        return list.filter(el => el.is_dir === false);
      }

      return [];
    },

    iconSize() {
      return elementSizes[this.elementSize].size;
    },

    gridTemplateColumns() {
      return `repeat(auto-fill, ${this.iconSize}px)`;
    },

    breadcrumbsItems() {
      const splitted = this.curPath.split('/');

      const items = splitted.map((title, i) => {
        const path = splitted.slice(0, i + 1).join('/');
        return { path, title, clickable: true };
      });

      if (items.length === 1 && items[0].path === '') {
        return [];
      }

      if (items.length >= 7) {
        const length = items.length - 1;
        items.splice(3, length - 5, { clickable: false });
        return items;
      }

      return items;
    },

    placeholderData() {
      if (this.isLoading) {
        return {
          icon: 'name_loader spinner',
          title: 'Идет загрузка...',
        };
      }

      if (this.search.length > 0) {
        return {
          icon: 'name_searchSmallMinus',
          title: 'По вашему запросу ничего не найдено',
        };
      }

      return {
        icon: 'name_gridRound',
        title: 'Список элементов пуст',
      };
    },

    isAllFilterChecked() {
      return this.filterList.every(f => f.checked === true);
    },

    sortTitle() {
      const sort = this.sortList.find(s => s.type === this.sortBy);
      return sort ? sort.title : '';
    },
  },
  mounted() {
    const queryParams = new URLSearchParams(location.search);
    const path = queryParams.get('path');
    this.getElementList(path || '');
  },
  methods: {
    async getUserGroups() {
      const { data } = await this.interactionSystem.GETRequest('dtcd_utils/v1/user?photo_quality=low');
      const { groups = [] } = data;

      if (!Array.isArray(groups) || !groups.length) {
        return [];
      }

      return groups;
    },

    async getElementList(path = '') {
      this.logSystem.info(`Getting element list in workspace panel on path '${path}'`);

      this.isLoading = true;
      this.elementList = [];

      try {
        const response = await this.interactionSystem.GETRequest(`${this.endpoint}/directory?path=${path}&action=list`);
        const { workspaces, directories } = response.data;

        workspaces.forEach(w => {
          w.is_dir = false;
          w.title = w.meta.title;
        });

        directories.forEach(d => {
          d.is_dir = true;
          d.title = d.meta.title;
        });

        const workspaceList = [...workspaces, ...directories];

        this.disabledCreateBtn = false;

        // const groups = await this.getUserGroups();
        // const groupsForWorkSpaces = groups
        //   .filter(group => group.name.includes('workspace.'))
        //   .map(item => item.name.split('.')[1]);

        // if (response?.data instanceof Array) {
        //   workspaceList = response.data;
        //   this.disabledCreateBtn = false;
        // } else if (response.data instanceof Object) {
        //   const { current_directory = {}, content = [] } = response.data;
        //   workspaceList = content.filter(item => !groupsForWorkSpaces.includes(item.title));
        //   this.disabledCreateBtn = current_directory.permissions?.create === false;
        // } else {
        //   throw new Error('Received invalid data from the server');
        // }

        for (const item of workspaceList) {
          if (!item.is_dir && !item.meta) {
            item.meta = { description: '', icon: 0, color: [0] };
          } else if (item.is_dir && !item.meta) {
            item.meta = { description: '' };
          }
          // TODO: delete this
          if (!item.permissions) {
            item.permissions = {
              create: true,
              read: true,
              update: true,
              delete: true,
            };
          }
        }

        this.curPath = path;
        this.elementList = workspaceList;

        if (path.length <= 0) return this.router.replace(`${location.pathname}`);

        const encodedPath = encodeURIComponent(path);
        this.router.replace(`${location.pathname}?path=${encodedPath}`);
      } catch (error) {
        const message = error.isAxiosError ? error.response.data.error : error.message;
        this.logSystem.error(`Error getting element list on path '${path}': ${message}`);
        this.notificationSystem.create(
          'Ошибка получения списка',
          `Произошла ошибка получения списка рабочих столов: ${message}`,
          { floatMode: true, floatTime: 5, type: 'error', },
        );
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    selectWorkspaceElement(elemData, ref) {
      this.selectedElement?.el?.classList.remove('selected');

      if (!elemData) {
        return (this.selectedElement = null);
      }

      const [el] = this.$refs[ref];
      el.classList.add('selected');

      this.selectedElement = { ...elemData, el };
    },

    async createElement(params = {}) {
      const { title, description, color, icon, isFolder, path } = params;

      const content = { title, column: 12, plugins: [] };

      const meta = isFolder ? { title, description } : { title, description, color, icon };
      const data = isFolder ? { meta } : { meta, content };
      const finalPath = path === '' ? title : `${path}/${title}`;
      const url = isFolder ? `/directory?path=${finalPath}&action=create` : `/workspace?path=${finalPath}`;

      try {
        this.logSystem.info(`Creating element on path '${path}'`);

        await this.interactionSystem.POSTRequest(this.endpoint + url, data);
        this.getElementList(path);

        const message = isFolder ? `Папка '${title}' добавлена` : `Рабочий стол '${title}' добавлен`;
        this.notificationSystem.create(
          'Элемент создан',
          `${message} в текущую директорию`,
          { floatMode: true, floatTime: 5, type: 'success' },
        );
      } catch (error) {
        const message = error.isAxiosError ? error.response.data.error : error.message;
        this.logSystem.error(`Error creating element on path '${path}': ${message}`);
        this.notificationSystem.create(
          'Ошибка создания элемента',
          `Произошла ошибка при создании ${isFolder ? 'папки' : 'рабочего стола'}: ${message}`,
          { floatMode: true, floatTime: 5, type: 'error' },
        );
      }
    },

    async openElem(elem) {
      const { is_dir, path } = elem;

      this.logSystem.info(`Opening element on path '${path}'`);

      if (!is_dir) {
        return this.router.navigate(`/workspaces/${encodeURIComponent(path)}`);
      }

      this.$refs.panel.click();
      this.getElementList(path);
    },

    openModal() {
      if (!this.disabledCreateBtn) this.isModalVisible = true;
    },

    closeModal() {
      this.isModalVisible = false;
      this.editElemParams = null;
    },

    async deleteElement(elem) {
      const { title, path, is_dir } = elem;
      const url = `/${is_dir ? 'directory' : 'workspace'}?path=${path}&action=delete`;

      try {
        this.logSystem.info(`Deleting element on path '${path}'`);

        await this.interactionSystem.POSTRequest(this.endpoint + url);
        this.getElementList(this.curPath);

        const successMsg = is_dir ? `Папка '${title}' успешно удалена` : `Рабочий стол '${title}' успешно удален`;
        this.notificationSystem.create(
          'Элемент удален',
          successMsg,
          { floatMode: true, floatTime: 5, type: 'success', },
        );
      } catch (error) {
        const message = error.isAxiosError ? error.response.data.error : error.message;
        this.logSystem.error(`Error deleting element on path '${path}': ${message}`);
        this.notificationSystem.create(
          'Ошибка удаления',
          `При удалении ${is_dir ? 'папки' : 'рабочего стола'} произошла ошибка: ${message}`,
          { floatMode: true, floatTime: 5, type: 'error' },
        );
        throw error;
      }
    },

    editElement(elem) {
      const { title, meta = {}, is_dir, path } = elem;
      const { description, icon, color } = meta;
      this.editElemParams = { isEditMode: true, elemParams: { title, description, is_dir, icon, color } };
      this.openModal();
    },

    async editElementData(elemData) {
      const { title, description, icon, color, curPath, isFolder } = elemData;
      const { path } = this.selectedElement;

      const meta = isFolder ? { title, description } : { title, description, color, icon };
      const url = isFolder ? `/directory?path=${path}&action=update` : `/workspace?path=${path}&action=update`;

      try {
        this.logSystem.info(`Editing element data on path '${path}'`);

        await this.interactionSystem.POSTRequest(this.endpoint + url, { meta });
        this.getElementList(curPath);

        this.notificationSystem.create(
          'Редатирование завершено',
          `Свойства ${isFolder ? 'папки' : 'рабочего стола'} изменены`,
          { floatMode: true, floatTime: 5, type: 'success' },
        );
      } catch (error) {
        const message = error.isAxiosError ? error.response.data.error : error.message;
        this.logSystem.error(`Error editing element on path '${path}': ${message}`);
        this.notificationSystem.create(
          'Ошибка редактирования',
          `В процессе редатирования ${isFolder ? 'папки' : 'рабочего стола'} произошла ошибка: ${message}`,
          { floatMode: true, floatTime: 5, type: 'error' },
        );
        throw error;
      }
    },

    async exportConfiguration(elem) {
      const { path, title, meta, content } = elem;

      try {
        this.logSystem.info(`Exporting cofiguration on path '${path}'`);

        const config = { title, meta, content };
        const configJson = JSON.stringify(config, null, 2);
        const configBlob = new Blob([configJson], { type: 'application/text' });

        const link = document.createElement('a');
        link.setAttribute('href', URL.createObjectURL(configBlob));
        link.setAttribute('download', `${title}.json`);
        link.click();
      } catch (error) {
        this.logSystem.error(`Error exporting cofiguration on path '${path}': ${error.message}`);
        this.notificationSystem.create(
          'Ошибка экспорта',
          `Произошла ошибка в процессе экспорта рабочего стола: ${error.message}`,
          { floatMode: true, floatTime: 5, type: 'error' },
        );
        throw error;
      }
    },

    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },

    async importConfiguration(params = {}) {
      const { title, file, path = '' } = params;

      if (!file) return;

      try {
        this.logSystem.info(`Importing cofiguration on path '${path}'`);

        const text = await this.readFile(file);
        const importedConfig = JSON.parse(text);
        const finalPath = path === '' ? title : `${path}/${title}`;
        const url = `/workspace?path=${finalPath}`;

        const { meta, content } = importedConfig;
        meta.title = title;
        content.title = title;

        await this.interactionSystem.POSTRequest(this.endpoint + url, { meta, content });
        this.getElementList(path);

        this.notificationSystem.create(
          'Импорт завершен',
          `Рабочий стол ${title} создан`,
          { floatMode: true, floatTime: 5, type: 'success' },
        );
      } catch (error) {
        const message = error.isAxiosError ? error.response.data.error : error.message;
        this.logSystem.error(`Error importing cofiguration on path '${path}': ${message}`);
        this.notificationSystem.create(
          'Ошибка импорта',
          `Произошла ошибка в процессе импорта рабочего стола: ${message}`,
          { floatMode: true, floatTime: 5, type: 'error' },
        );
        throw error;
      }
    },
  },
  filters: {
    truncate: function (text, length, suffix) {
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    },
  },
};
</script>

<style lang="sass" scoped>
*
  margin: 0
  padding: 0
  box-sizing: border-box

.workspace-panel
  display: grid
  grid-template-rows: auto auto 1fr
  height: 100%
  color: var(--text_main)
  font-family: 'Proxima Nova'
  background-color: var(--background_secondary)

  .breadcrumbs
    display: flex
    padding: 10px 20px
    padding-bottom: 0

    .breadcrumbs-item
      display: flex
      align-items: center
      height: 20px
      cursor: pointer
      padding: 0 17px
      transform: skew(-15deg)
      border: 1px solid var(--border)
      margin-left: 2px
      border-radius: 4.44px
      font-size: 12px
      background-color: var(--border_24)
      user-select: none

      .title
        display: flex
        transform: skew(15deg)

  .header
    display: flex
    align-items: center
    justify-content: space-between
    gap: 32px
    padding: 10px 20px
    box-shadow: 1px 1px 2px 0px rgba(8, 18, 55, 0.12)
    z-index: 1

    .search-field
      flex: 1 1
      max-width: 320px

    .action-panel
      flex: 1 0
      display: flex
      gap: 32px

      .toggle-btn
        display: flex
        align-items: center
        gap: 8px
        cursor: pointer
        padding: 6px 0
        user-select: none
        color: var(--text_secondary)

        .title,
        .subtitle
          font-family: 'Proxima Nova'
          font-size: 17px

        .title
          font-weight: 700

          @media (max-width: 576px)
            display: none

      .dropdown-menu
        display: flex
        flex-direction: column
        gap: 10px
        background-color: var(--background_main)
        border: 1px solid var(--border)
        border-radius: 8px
        box-shadow: 0px 4px 12px 0px rgba(8, 18, 55, 0.12), 1px 1px 2px 0px rgba(8, 18, 55, 0.12)
        padding: 16px

        .menu-item-title
          display: block
          width: 100%
          cursor: pointer
          font-size: 14px
          font-weight: 400
          user-select: none

          &.selected
            color: var(--button_primary)

    .create-elem-btn
      .icon
        margin-right: 12px

      .title
        font-size: 17px

  .element-list-wrapper
    overflow: auto

    .element-list-placeholder
      display: flex
      align-items: center
      justify-content: center
      flex-direction: column
      height: 100%
      color: var(--main_text)
      font-size: 17px

      .icon
        font-size: 150px
        color: var(--border_secondary)
        margin-bottom: 8px

        &.spinner
          animation-name: spin
          animation-duration: 1s
          animation-iteration-count: infinite
          animation-timing-function: linear
          transform-origin: 50% 50%
          will-change: transform

          @keyframes spin
            100%
              transform: rotate(360deg)

    .element-list
      padding: 20px
      display: grid
      gap: 50px
      justify-content: space-between
      align-items: start

      @media (max-width: 600px)
        justify-content: space-around
        width: 100vw

      &:empty
        background-color: red
        padding: 0

      .list-item
        display: flex
        align-items: center
        flex-direction: column
        cursor: pointer
        user-select: none
        border-radius: 8px
        font-size: 11px
        font-weight: 400
        line-height: 12px
        position: relative
        transition: background-color .3s

        &:hover,
        &.selected
          background-color: var(--button_primary_12)

          .title
            color: var(--button_primary)

        &.disabled
          opacity: .5
          cursor: not-allowed

        .ElementTooltip
          align-self: stretch
          margin-top: 6px
          text-align: center
          overflow-wrap: break-word
          padding: 0 4px 2px
          transition: color .3s
</style>
