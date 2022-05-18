<template>
  <div class="workspace-panel" ref="panel" @click.self="selectWorkspaceElement(null)">
    <ModalWindow
      v-if="isModalVisible"
      @close="isModalVisible = false"
      @createWorkspace="createWorkspace"
    />
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
      <div
        class="create-elem-btn"
        :style="{ width: `${iconSize}px`, height: `${iconSize}px`, borderRadius: `${iconRadius}px` }"
        @click="createNewWorkspace"
      >
        <span class="FontIcon name_plusCircleOutline size_lg"></span>
        <div class="title">
          <span>Добавить</span>
          <span>элемент</span>
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
    plugin: $root.plugin,
    isModalVisible: false,
    configurationList: [],
    search: '',
    tempTitle: '',
    editTitleID: -1,
    editMode: false,
    elementSize: 'medium',
    selectedElement: null,
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

    iconRadius() {
      return elementSizes[this.elementSize].radius;
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
  min-height: 100%
  color: var(--text_main)
  font-family: 'Proxima Nova'
  font-size: 11px
  font-weight: 400
  line-height: 12px
  background-color: var(--background_secondary)

  .FontIcon
    color: var(--text_secondary)

  .configuration-list
    padding: 60px 20px
    display: grid
    gap: 50px
    justify-content: space-between
    align-items: start

    @media (max-width: 600px)
      justify-content: space-around
      width: 100vw

    .create-elem-btn
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      cursor: pointer
      gap: 7px
      background-color: var(--border_secondary)
      border: 1px solid var(--border)

      .icon
        fill: var(--text_secondary)

      .title
        display: flex
        flex-direction: column
        text-align: center

    .list-item
      display: flex
      align-items: center
      flex-direction: column
      cursor: pointer
      user-select: none
      border-radius: 8px
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
