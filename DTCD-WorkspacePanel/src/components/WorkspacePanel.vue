<template>
  <div class="workspace-panel" ref="panel" @click.self="selectWorkspaceElement(null)">
    <ModalWindow
      v-if="isModalVisible"
      @close="isModalVisible = false"
      @createWorkspace="createWorkspace"
    />
    <div class="header">
      <base-input class="search-field" size="big" placeholder="Поиск">
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
            <base-checkbox>
              <span class="menu-item-title">Все элементы</span>
            </base-checkbox>
            <base-checkbox
              v-for="(filter, index) in filterList"
              :key="index"
            >
              <span class="menu-item-title" v-text="filter.title"/>
            </base-checkbox>
          </nav>
        </base-dropdown>

        <base-dropdown>
          <span slot="icon-arrow"></span>
          <span slot="toggle-btn" class="toggle-btn">
            <span class="FontIcon name_sort size_lg"></span>
            <span class="title">Сортировка:</span>
            <span class="subtitle">По алфавиту</span>
          </span>
          <nav class="dropdown-menu">
            <span class="menu-item-title">По алфавиту</span>
            <span class="menu-item-title">По типу</span>
            <span class="menu-item-title">По дате создания</span>
            <span class="menu-item-title">По дате изменения</span>
          </nav>
        </base-dropdown>
      </div>

      <base-button
        class="create-elem-btn"
        theme="theme_alfa"
        size="big"
        @click="createNewWorkspace"
      >
        <span class="FontIcon name_plusCircleOutline size_lg icon"></span>
        <span class="title">Добавить элемент</span>
      </base-button>
    </div>
    <div
      class="configuration-list"
      :style="{ gridTemplateColumns }"
      @click.self="selectWorkspaceElement(null)"
    >
      <div
        v-for="config in configurationsToShow"
        :key="config.id"
        :ref="config.id"
        class="list-item"
        @click="selectWorkspaceElement(config)"
        @dblclick="openWorkspace(config.id)"
      >
        <WorkspaceElementIcon :size="elementSize"/>
        <span class="title" v-text="config.title"/>
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
    plugin: $root.plugin,
    isModalVisible: false,
    configurationList: [],
    search: '',
    tempTitle: '',
    editTitleID: -1,
    editMode: false,
    elementSize: 'medium',
    selectedElement: null,
    filterList: [
      { title: 'Папки' },
      { title: 'Дашборды' },
      { title: 'Скрытые элементы' },
    ],
    sortList: [
      { title: 'По алфавиту' },
      { title: 'По типу' },
      { title: 'По дате создания' },
      { title: 'По дате изменения' },
    ],
  }),
  computed: {
    configurationsToShow() {
      if (this.configurationList) {
        if (this.search)
          return this.configurationList.filter(conf =>
            conf.title.toLowerCase().includes(this.search.toLowerCase())
          );
        return this.configurationList;
      }
      return [];
    },

    iconSize() {
      return elementSizes[this.elementSize].size;
    },

    gridTemplateColumns() {
      return `repeat(auto-fill, ${this.iconSize + 2}px)`
    }
  },
  async mounted() {
    await this.getConfigurationList();
  },
  methods: {
    async getConfigurationList() {
      this.configurationList = await this.$root.workspaceSystem.getConfigurationList();
    },

    selectWorkspaceElement(elemData) {
      this.selectedElement?.el?.classList.remove('selected');

      if (!elemData) {
        return this.selectedElement = null;
      }

      const [el] = this.$refs[elemData.id]
      el.classList.add('selected');

      this.selectedElement = { ...elemData, el };
    },

    async createWorkspace(newTitle) {
      await this.$root.workspaceSystem.createEmptyConfiguration(newTitle);
      await this.getConfigurationList();
    },

    async saveTitle(configuration) {
      if (this.tempTitle != '') {
        try {
          await this.$root.workspaceSystem.changeConfigurationTitle(
            configuration.id,
            this.tempTitle
          );
          configuration.title = this.tempTitle;
          this.tempTitle = '';
          this.editTitleID = -1;
        } catch (err) {
          console.log(err);
        } finally {
          this.editMode = false;
        }
      }
    },

    openWorkspace(id) {
      if (!this.editMode) {
        this.$root.router.navigate(`/workspaces/${id}`);
      }
    },

    createNewWorkspace() {
      this.isModalVisible = true;
    },

    changeTemplateTitle(configuration) {
      this.editMode = true;
      this.tempTitle = configuration.title;
      this.editTitleID = configuration.id;
    },

    async deleteConfiguration(id) {
      await this.$root.workspaceSystem.deleteConfiguration(id);
      this.configurationList = this.configurationList.filter(conf => conf.id != id);
    },

    async exportConfiguration(id) {
      const conf = await Application.getSystem('WorkspaceSystem', '0.4.0').downloadConfiguration(
        id
      );
      const blobURL = URL.createObjectURL(
        new Blob([JSON.stringify(conf)], { type: 'application/text' })
      );
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobURL, `${conf.title}.json`);
      } else {
        const aElement = document.createElement('a');
        aElement.setAttribute('href', blobURL);
        aElement.setAttribute('download', `${conf.title}.json`);
        aElement.style.display = 'none';
        document.body.appendChild(aElement);
        aElement.click();
        document.body.removeChild(aElement);
      }
    },

    async importConfiguration() {
      const fileInputElement = document.createElement('input');
      fileInputElement.setAttribute('type', 'file');
      fileInputElement.style.display = 'none';
      fileInputElement.addEventListener('change', () => {
        if (!fileInputElement.files || fileInputElement.files.length <= 0) {
          throw new Error('There is no file to open');
        }
        const reader = new FileReader();
        const onLoadEndCallback = async evt => {
          const fileReader = evt.target;
          if (fileReader.error === null) {
            const config = JSON.parse(fileReader.result);
            delete config.id;
            await Application.getSystem('WorkspaceSystem', '0.4.0').importConfiguration(config);
            await this.getConfigurationList();
          } else {
            throw Error(fileReader.error);
          }
        };
        reader.fileName = fileInputElement.files[0].name;
        reader.onloadend = onLoadEndCallback;
        reader.readAsText(fileInputElement.files[0]);
        document.body.removeChild(fileInputElement);
      });
      document.body.appendChild(fileInputElement);
      fileInputElement.click();
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
  grid-template-rows: auto 1fr
  height: 100%
  color: var(--text_main)
  font-family: 'Proxima Nova'
  background-color: var(--background_secondary)

  .FontIcon
    color: var(--text_secondary)

  .header
    display: flex
    align-items: center
    justify-content: space-between
    gap: 32px
    padding: 20px
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
        padding: 6px
        user-select: none

        .title,
        .subtitle
          font-family: 'Proxima Nova'
          font-size: 17px
          color: var(--text_secondary)

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
          font-size: 14px
          font-weight: 400
          user-select: none

    .create-elem-btn
      cursor: pointer
      padding: 5px 0

      .icon
        color: var(--button_primary)
        margin-right: 12px

      .title
        font-size: 17px

  .configuration-list
    padding: 20px
    display: grid
    gap: 50px
    justify-content: space-between
    align-items: start
    overflow: auto

    @media (max-width: 600px)
      justify-content: space-around
      width: 100vw

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

      .title
        align-self: stretch
        margin-top: 6px
        text-align: center
        overflow-wrap: break-word
        padding: 0 4px 2px
        transition: color .3s
</style>
