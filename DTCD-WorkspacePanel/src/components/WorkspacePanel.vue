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
    <div class="configuration-list">
      <div
        class="list-item"
        v-for="configuration in configurationsToShow"
        :value="configuration.id"
        :key="configuration.id"
        @click="selectWorkspace(configuration.id)"
      >
        {{ configuration.title }}
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
    selectWorkspace(id) {
      this.$root.eventSystem.createAndPublish(this.$root.guid, 'WorkspaceSelection', {
        id,
      });
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

.configuration-list {
  display: flex;
  flex-direction: column;
}

.list-item {
  cursor: pointer;
  padding: 12px 8px;
  background: #eee;
  transition: 0.2s;
}

.list-item:nth-child(odd) {
  background: #f9f9f9;
}

.list-item:hover {
  background: #ddd;
}
</style>
