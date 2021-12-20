<template>
  <div class="panel-container">
    <ModalWindow v-if="isModalVisible" @close="closeModal" @createWorkspace="createWorkspace" />
    <div class="panel-header">
      <h2>Select workspace configuration</h2>
    </div>
    <div class="form-field">
      <div class="label-wrapper">
        <label>Search</label>
      </div>
      <input type="text" class="input" v-model="search" />
    </div>
    <button class="btn" @click="createNewWorkspace">Create</button>
    <button class="btn" @click="importConfiguration">Import</button>
    <div class="configuration-list">
      <div
        class="list-item"
        v-for="configuration in configurationsToShow"
        :value="configuration.id"
        :key="configuration.id"
        @click.self="selectWorkspace(configuration.id)"
      >
        <input
          v-if="editTitleID === configuration.id"
          @keydown.enter="saveTitle(configuration)"
          type="text"
          v-model="tempTitle"
        />
        <div v-else @click.self="selectWorkspace(configuration.id)">{{ configuration.title }}</div>
        <div class="list-item-button-container">
          <div
            v-show="editTitleID === configuration.id"
            class="icon"
            @click="saveTitle(configuration)"
          >
            <i class="fas fa-save" />
          </div>
          <div
            v-show="editTitleID !== configuration.id"
            class="icon"
            @click="changeTemplateTitle(configuration)"
          >
            <i class="fas fa-edit" />
          </div>
          <div
            v-show="editTitleID !== configuration.id"
            class="icon"
            @click="exportConfiguration(configuration.id)"
          >
            <i class="fas fa-file-import"></i>
          </div>
          <div
            v-show="editTitleID !== configuration.id"
            class="icon"
            @click="deleteConfiguration(configuration.id)"
          >
            <i class="fas fa-trash-alt" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModalWindow from '@/components/ModalWindow';
export default {
  name: 'WorkspacePanel',
  components: { ModalWindow },
  data() {
    return {
      isModalVisible: false,
      configurationList: [],
      search: '',
      tempTitle: '',
      editTitleID: -1,
      editMode: false,
    };
  },
  async mounted() {
    await this.getConfigurationList();
  },
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
  },
  methods: {
    async getConfigurationList() {
      this.configurationList = await this.$root.workspaceSystem.getConfigurationList();
    },
    closeModal() {
      this.isModalVisible = false;
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
    selectWorkspace(id) {
      if (!this.editMode) this.$root.workspaceSystem.setConfiguration(id);
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
      const conf = await Application.getSystem('WorkspaceSystem').downloadConfiguration(id);
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
            await Application.getSystem('WorkspaceSystem').importConfiguration(config);
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

<style scoped>
.panel-container {
  padding: 15px;
}

.label-wrapper {
  padding: 0.4rem 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.25;
}

.form-field {
  margin-bottom: 10px;
}

.input {
  padding: 0.5rem;
  border: 1px solid rgb(199, 208, 217);
  width: 200px;
}
.btn {
  padding: 0 20px;
  height: 30px;
}
.configuration-list {
  display: flex;
  flex-direction: column;
}

.list-item {
  cursor: pointer;
  padding: 12px 8px;
  background: #eee;
  transition: 0.2s;
  display: flex;
  justify-content: space-between;
}
.list-item-button-container {
  display: flex;
}
.icon {
  margin-left: 5px;
  /* color: grey; */
}

.list-item:nth-child(odd) {
  background: #f9f9f9;
}

.list-item:hover {
  background: #ddd;
}
</style>
