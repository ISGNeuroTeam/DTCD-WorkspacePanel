<template>
  <div class="panel-container">
    <div class="panel-header">
      <h2>Select workspace configuration</h2>
    </div>
    <div class="form-field">
      <div class="label-wrapper">
        <label>Search</label>
      </div>
      <input type="text" class="input" v-model="search" />
    </div>
    <button class="btn" @click="createNewWorkspace">Create new</button>
    <div class="configuration-list">
      <div
        class="list-item"
        v-for="configuration in configurationsToShow"
        :value="configuration.id"
        :key="configuration.id"
        @click.self="selectWorkspace(configuration.id)"
      >
        <input v-if="editTitleID === configuration.id" type="text" v-model="tempTitle" />
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
            @click="deleteConfiguration(configuration)"
          >
            <i class="fas fa-trash-alt" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkspacePanel',
  data() {
    return {
      configurationList: [],
      search: '',
      tempTitle: '',
      editTitleID: -1,
    };
  },
  mounted() {
    this.$root.interactionSystem.GETRequest('/v2/workspace/object').then(response => {
      this.configurationList = response.data;
    });
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
    saveTitle(configuration) {
      if (this.tempTitle != '') {
        this.$root.interactionSystem
          .PUTRequest('/v2/workspace/object', [
            {
              id: this.editTitleID,
              title: this.tempTitle,
            },
          ])
          .then(res => {
            configuration.title = this.tempTitle;
            this.tempTitle = '';
            this.editTitleID = -1;
          });
      }
    },
    selectWorkspace(id) {
      this.$root.eventSystem.createAndPublish(this.$root.guid, 'WorkspaceSelection', {
        id,
      });
    },
    createNewWorkspace() {
      this.$root.eventSystem.createAndPublish(this.$root.guid, 'OpenEmptyWorkspace');
    },
    changeTemplateTitle(configuration) {
      this.tempTitle = configuration.title;
      this.editTitleID = configuration.id;
    },
    deleteConfiguration(configuration) {
      const { id } = configuration;
      this.$root.eventSystem.createAndPublish(this.$root.guid, 'WorkspaceDelete', {
        id,
      });
      this.configurationList = this.configurationList.filter(conf => conf.id != id);
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
  width: 80px;
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
