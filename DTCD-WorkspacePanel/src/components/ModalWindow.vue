<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <slot name="header"> Создание рабочего стола</slot>
          <button type="button" class="btn-close" @click="close">x</button>
        </header>
        <section class="modal-body">
          <div class="form-field">
            <div class="label-wrapper">
              <label :style="{ color: color }">Title</label>
            </div>
            <input
              id="ttl"
              type="text"
              class="input"
              v-model="tempTitle"
              :style="{ borderColor: color }"
            />
          </div>
        </section>
        <footer class="modal-footer">
          <button type="button" class="footer-btn" @click="save">Save</button>
          <button type="button" class="footer-btn" @click="close">Close</button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModalWindow',
  data() {
    return {
      tempTitle: '',
      color: 'none',
    };
  },
  methods: {
    close() {
      this.$emit('close');
      this.clearTempValue();
    },
    save() {
      if (this.tempTitle === '') {
        this.color = 'red';
        return;
      }
      this.color = 'none';
      this.$emit('createWorkspace', this.tempTitle);
      this.close();
    },
    clearTempValue() {
      this.tempTitle = '';
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

.modal {
  background: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  height: 25vh;
  width: 50vh;
  display: flex;
  flex-direction: column;
  z-index: 30;
  position: relative;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  justify-content: space-between;
}

.modal-footer {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 5px;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: #757575;
  background: transparent;
}
.btn-close:hover {
  color: #2196f3;
}

.footer-btn {
  padding: 5px;
  width: 80px;
  margin: 2px 5px;
}

.input {
  padding: 0.5rem;
  border: 1px solid rgb(199, 208, 217);
  width: 100%;
  max-width: 500px;
}
.label-wrapper {
  padding: 0.2rem;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;
}
.form-field {
  margin-bottom: 10px;
}
</style>
