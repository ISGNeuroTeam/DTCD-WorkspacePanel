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
          v-for="elem in elementsToShow"
          :key="elem.id"
          :ref="elem.id"
          :class="['list-item', !elem.permissions.read && 'disabled']"
          @click="selectWorkspaceElement(elem)"
          @dblclick="elem.permissions.read && openElem(elem)"
        >
          <WorkspaceElementIcon v-if="elem.is_dir" :isFolder="elem.is_dir" />
          <WorkspaceElementIcon v-else :icon="elem.meta.icon" :colors="elem.meta.color" />
          <base-tooltip class="ElementTooltip" :content="elem.title"  placement="bottom">
            <span class="title type_dashboard">{{ elem.title | truncate( 21, '...') }}</span>
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
import utf8_to_base64 from './../libs/utf8tobase64';

export default {
  name: 'WorkspacePanel',
  components: { ModalWindow, WorkspaceElementIcon },
  data: ({ $root }) => ({
    interactionSystem: $root.interactionSystem,
    logSystem: $root.logSystem,
    notificationSystem: $root.notificationSystem,
    endpoint: '/dtcd_workspaces/v1/workspace/object/',
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
    this.getElementList();
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
      this.logSystem.info(`Getting element list in workspace panel on path '${path}'.`);

      const pathBase64 = utf8_to_base64(path);
      this.isLoading = true;
      this.elementList = [];
      try {
        const response = await this.interactionSystem.GETRequest(this.endpoint + pathBase64);
        let workspaceList;

        const groups = await this.getUserGroups()
        const groupsForWorkSpaces = groups.filter(group => group.name.includes('workspace.')).map((item) => item.name.split('.')[1])

        if (response?.data instanceof Array) {
          workspaceList = response.data
          this.disabledCreateBtn = false;
        } else if (response.data instanceof Object) {
          const { current_directory = {}, content = [] } = response.data;
          workspaceList = content.filter(item => !groupsForWorkSpaces.includes(item.title));
          // workspaceList = content
          this.disabledCreateBtn = current_directory.permissions?.create === false;
        } else {
          throw new Error('Received invalid data from the server');
        }


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
      } catch (error) {
        this.logSystem.error(`Error getting element list on path '${path}': ${error.message}`);
        this.notificationSystem.create(
          'Error in workspaces',
          `Произошла ошибка получения списка рабочих столов.`,
          {
            floatMode: true,
            floatTime: 5,
            type: 'error',
          }
        );
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    selectWorkspaceElement(elemData) {
      this.selectedElement?.el?.classList.remove('selected');

      if (!elemData) {
        return (this.selectedElement = null);
      }

      const [el] = this.$refs[elemData.id];
      el.classList.add('selected');

      this.selectedElement = { ...elemData, el };
    },

    async createElement(data = {}) {
      const {
        isFolder,
        title,
        path,
      } = data;

      this.logSystem.info(`Creating element on path '${path}'.`);

      try {
        await this.$root.workspaceSystem.createEmptyConfiguration(data);

        const successMsg = isFolder
                        ? `Папка '${title}' добавлена в текущую директорию.`
                        : `Рабочий стол '${title}' добавлен в текущую директорию.`;
        this.notificationSystem.create(
          'Готово',
          successMsg,
          {
            floatMode: true,
            floatTime: 5,
            type: 'success',
          }
        );
      } catch (error) {
        this.logSystem.error(`Error creating element on path '${path}': ${error.message}`);
        const errorMsg = 'Произошла ошибка создания '
                        + (isFolder ? 'папки' : 'рабочего стола') + '.';
        this.notificationSystem.create(
          'Error in workspaces!',
          errorMsg,
          {
            floatMode: true,
            floatTime: 5,
            type: 'error',
          }
        );
      }

      this.getElementList(data.path);
    },

    async openElem(elem) {
      const {
        id,
        is_dir,
        path,
      } = elem;

      this.logSystem.info(`Opening element on path '${path}'.`);

      if (!is_dir) {
        if (path === '') {
          this.$root.router.navigate(`/workspaces/${id}`);
        } else {
          this.$root.router.navigate(`/workspaces/${utf8_to_base64(path)}:id=${id}`);
        }
      }
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
      const {
        title,
        path,
        is_dir,
        id,
      } = elem;

      this.logSystem.info(`Deleting element on path '${path}'.`);

      try {
        if (!is_dir) {
          const req = path === '' ? this.endpoint : this.endpoint + utf8_to_base64(path);
          await this.interactionSystem.DELETERequest(req, { data: [id] });
          this.getElementList(path);
        } else {
          await this.interactionSystem.DELETERequest(this.endpoint + utf8_to_base64(path));
          this.getElementList(this.curPath);
        }

        const successMsg = is_dir
                          ? `Папка '${title}' (ID ${id}) успешно удалена.`
                          : `Рабочий стол '${title}' (ID ${id}) успешно удален.`;
        this.notificationSystem.create(
          'Готово',
          successMsg,
          {
            floatMode: true,
            floatTime: 5,
            type: 'success',
          }
        );
      } catch (error) {
        this.logSystem.error(`Error deleting element on path '${path}': ${error.message}`);
        const errorMsg = 'Произошла ошибка удаления '
                        + (is_dir ? 'папки' : 'рабочего стола') + '.';
        this.notificationSystem.create(
          'Error in workspaces',
          errorMsg,
          {
            floatMode: true,
            floatTime: 5,
            type: 'error',
          }
        );
        throw error;
      }
    },

    editElement(elem) {
      const { title, meta = {}, is_dir } = elem;
      const description = meta.description;
      this.editElemParams = {
        title,
        description,
        is_dir,
        icon: meta.icon,
        color: meta.color,
        isEditMode: true,
      };
      this.openModal();
    },

    async editElementData(data) {
      const {
        title,
        description,
        icon,
        color,
        curPath,
        isFolder,
      } = data;
      const {
        id,
        path,
      } = this.selectedElement;

      this.logSystem.info(`Editing element data on path '${path}'.`);

      try {
        if (data.isFolder) {
          await this.interactionSystem.PUTRequest(this.endpoint + `${utf8_to_base64(path)}`, [{ new_title: title }]);
        } else {
          const meta = { description, icon, color };
          await this.interactionSystem.PUTRequest(this.endpoint + `${utf8_to_base64(path)}`, [{ id, title, meta }]);
        }

        this.getElementList(curPath);

        const successMsg = 'Редактирование свойств '
                          + (isFolder ? 'папки' : 'рабочего стола')
                          + ` '${title}' (ID ${id}) успешно завершено.`;
        this.notificationSystem.create(
          'Готово',
          successMsg,
          {
            floatMode: true,
            floatTime: 5,
            type: 'success',
          }
        );
      } catch (error) {
        this.logSystem.error(`Error editing element on path '${path}': ${error.message}`);
        const errorMsg = 'Произошла ошибка в процессе редактирования свойств '
                        + (isFolder ? 'папки' : 'рабочего стола') + '.';
        this.notificationSystem.create(
          'Error in workspaces',
          errorMsg,
          {
            floatMode: true,
            floatTime: 5,
            type: 'error',
          }
        );
        throw error;
      }
    },

    async exportConfiguration(elem) {
      const {
        id,
        path,
        is_dir,
        title,
      } = elem;
      const pathBase64 = utf8_to_base64(path);

      this.logSystem.info(`Exporting cofiguration on path '${path}'.`);

      try {
        const { data: config } = await this.interactionSystem.GETRequest(this.endpoint + `${pathBase64}?id=${id}`);

        const configJson = JSON.stringify(config, null, 2);
        const configBlob = new Blob([configJson], { type: 'application/text' });

        const link = document.createElement('a');
        link.setAttribute('href', URL.createObjectURL(configBlob));
        link.setAttribute('download', `${config.title}.json`);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const successMsg = 'Экспорт '
                          + (is_dir ? 'папки' : 'рабочего стола')
                          + ` '${title}' (ID ${id}) успешно завершен.`;
        this.notificationSystem.create(
          'Готово',
          successMsg,
          {
            floatMode: true,
            floatTime: 5,
            type: 'success',
          }
        );
      } catch (error) {
        this.logSystem.error(`Error exporting cofiguration on path '${path}': ${error.message}`);
        const errorMsg = 'Произошла ошибка в процессе экспортирования рабочего стола или папки.';
        this.notificationSystem.create(
          'Error in workspaces',
          errorMsg,
          {
            floatMode: true,
            floatTime: 5,
            type: 'error',
          }
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
      const { file, path = '' } = params;

      try {
        if (!file) return;

        this.logSystem.info(`Importing cofiguration on path '${path}'.`);

        const text = await this.readFile(file);
        const importedConfig = JSON.parse(text);

        const {
          title,
          content,
          meta,
          is_dir,
        } = importedConfig;

        if ('id' in content) delete content.id;

        await this.interactionSystem.POSTRequest(this.endpoint + utf8_to_base64(path), [{ title, content, meta }]);

        const successMsg = 'Импорт '
                          + (is_dir ? 'папки' : 'рабочего стола')
                          + ` '${title}' успешно завершен.`;
        this.notificationSystem.create(
          'Готово',
          successMsg,
          {
            floatMode: true,
            floatTime: 5,
            type: 'success',
          }
        );
      } catch (error) {
        this.logSystem.error(`Error importing cofiguration on path '${path}': ${error.message}`);
        const errorMsg = 'Произошла ошибка в процессе импортирования рабочего стола или папки.';
        this.notificationSystem.create(
          'Error in workspaces',
          errorMsg,
          {
            floatMode: true,
            floatTime: 5,
            type: 'error',
          }
        );
        throw error;
      }

      this.getElementList(path);
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
