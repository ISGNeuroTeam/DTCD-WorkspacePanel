<template>
  <transition name="modal-fade">
    <div class="ModalBackdrop">
      <div class="ModalWindow">
        <header class="ModalHeader">
          <base-heading theme="theme_subheaderSmall">
            <h1>Новый элемент</h1>
          </base-heading>
          <button type="button" class="ButtonClose" @click="close">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 1.61143L14.3886 0L8 6.38857L1.61143 0L0 1.61143L6.38857 8L0 14.3886L1.61143 16L8 9.61143L14.3886 16L16 14.3886L9.61143 8L16 1.61143Z"
                fill="#C6C6D4"
              />
            </svg>
          </button>
        </header>

        <section class="FormField">
          <base-input
            ref="workspaceTitle"
            label="Название"
            placeholder="Введите название рабочего стола"
          >
          </base-input>
        </section>

        <footer class="ModalFooter">
          <base-button type="button" theme="theme_secondary" class="ButtonClose" @click="close">
            Отменить
          </base-button>
          <base-button type="button" @click="save"> Сохранить </base-button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModalWindow',
  methods: {
    close() {
      this.$emit('close');
      this.clearTempValue();
    },
    save() {
      if (this.$refs.workspaceTitle.value === '') {
        console.log(this.$refs.workspaceTitle);
        return;
      }
      this.$emit('createWorkspace', this.$refs.workspaceTitle.value);
      this.close();
    },
    clearTempValue() {
      this.$refs.workspaceTitle.value = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.ModalBackdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;

  &,
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  .ModalWindow {
    background-color: var(--background_main);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    height: 30vh;
    width: 60vh;
    display: flex;
    flex-direction: column;
    z-index: 30;
    position: relative;
    padding: 15px 30px;

    .ModalHeader,
    .ModalFooter {
      display: flex;
    }

    .ModalHeader {
      position: relative;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
    }

    .ButtonClose {
      display: flex;
      border: none;
      cursor: pointer;
      background: transparent;
      padding: 0;

      & > svg:hover {
        path {
          fill: var(--button_primary_72);
        }
      }
    }

    .FormField {
      margin-bottom: 12px;
    }

    .ModalFooter {
      margin-top: auto;
      justify-content: flex-end;

      .ButtonClose {
        padding-right: 10px;
      }
    }
  }
}
</style>
