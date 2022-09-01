<template>
  <transition name="modal-fade">
    <div class="ModalBackdrop">
      <div class="ModalWindow">
        <header class="ModalHeader">
          <base-heading theme="theme_subheaderSmall">
            <h1 v-text="windowTItle"/>
          </base-heading>
          <button
            type="button"
            class="ButtonClose"
            @click="close"
          >
            <span class="FontIcon name_closeBig size_lg"></span>
          </button>
        </header>

        <section class="ModalBody">
          <span v-if="!isEditMode" class="ItemLabel">Добавить элемент</span>
          <base-tabs ref="createModeType" @select="actionTabSelectHandler">
            <div slot="tab" tab-name="Новый">
              <span v-if="!isEditMode" class="ItemLabel">Тип элемента</span>
              <base-tabs ref="elemType" @select="elemTypeTabSelectHandler">
                <div slot="tab" tab-name="Дашборд">
                  <base-input
                    :value="title"
                    class="FieldName"
                    label="Название (23 знака)"
                    placeholder="Введите название"
                    @input="title = $event.target.value"
                  >
                  </base-input>
                  <base-textarea
                    :value="description"
                    theme="resize_off"
                    class="FieldDescription"
                    label="Описание (200 знака)"
                    placeholder="Введите описание"
                    @input="description = $event.target.value"
                  >
                  </base-textarea>
                  <!-- COMMENTED FOR FUTURE -->
                  <!-- <span class="ItemLabel">Приватность</span>
                  <base-tabs>
                    <div slot="tab" tab-name="Общий"></div>
                    <div slot="tab" tab-name="Личный"></div>
                  </base-tabs> -->
                  <base-select
                    :value="backgroundMode"
                    class="SelectBackground"
                    label="Фон элемента"
                    @input="backgroundMode = $event.target.value"
                  >
                    <div slot="item" value="Сплошной">Сплошной</div>
                    <div slot="item" value="Градиент">Градиент</div>
                  </base-select>

                  <div class="SectionChoice">
                    <span class="ItemLabel" v-text="mainColorSelectTitle"/>
                    <!-- COMMENTED FOR FUTURE -->
                    <!-- <base-button theme="theme_alfa" size="small">
                      Свой цвет
                      <span slot="icon-left" class="FontIcon name_colorPicker"></span>
                    </base-button> -->
                  </div>
                  <div class="SelectColor">
                    <div
                      v-for="(color, i) in colorList"
                      class="ColorBox"
                      :key="color"
                      :class="{ selected: mainColor === i }"
                      :style="{ backgroundColor: color }"
                      @click="mainColor = i"
                    >
                      <span class="FontIcon name_check size_lg Icon"></span>
                    </div>
                  </div>

                  <template v-if="backgroundMode === 'Градиент'">
                    <div class="SectionChoice">
                      <span class="ItemLabel">Выберете цвет #2</span>
                      <!-- COMMENTED FOR FUTURE -->
                      <!-- <base-button theme="theme_alfa" size="small">
                        Свой цвет
                        <span slot="icon-left" class="FontIcon name_colorPicker"></span>
                      </base-button> -->
                    </div>
                    <div class="SelectColor">
                      <div
                        v-for="(color, i) in colorList"
                        class="ColorBox"
                        :key="color"
                        :class="{ selected: secondColor === i }"
                        :style="{ backgroundColor: color }"
                        @click="secondColor = i"
                      >
                        <span class="FontIcon name_check size_lg Icon"></span>
                      </div>
                    </div>
                  </template>

                  <div class="SectionChoice">
                    <span class="ItemLabel">Выберите иконку</span>
                    <!-- COMMENTED FOR FUTURE -->
                    <!-- <base-button theme="theme_alfa" size="small">
                      Загрузить свою
                      <span slot="icon-left" class="FontIcon name_download"></span>
                    </base-button> -->
                  </div>
                  <div class="SelectIcon">
                    <span
                      v-for="(iconClass, i) in iconList"
                      class="FontIcon size_lg Icon"
                      :key="iconClass"
                      :class="[iconClass, icon === i ? 'selected' : '']"
                      @click="icon = i"
                    ></span>
                  </div>
                </div>

                <div slot="tab" tab-name="Папка">
                  <base-input
                    :value="title"
                    class="FieldName"
                    label="Название (23 знака)"
                    placeholder="Введите название"
                    @input="title = $event.target.value"
                  ></base-input>

                  <base-textarea
                    :value="description"
                    theme="resize_off"
                    class="FieldDescription"
                    label="Описание (200 знака)"
                    placeholder="Введите описание"
                    @input="description = $event.target.value"
                  ></base-textarea>

                  <!-- COMMENTED FOR FUTURE -->
                  <!-- <span class="ItemLabel">Приватность</span>
                  <base-tabs>
                    <div slot="tab" tab-name="Общий"></div>
                    <div slot="tab" tab-name="Личный"></div>
                  </base-tabs> -->

                </div>
              </base-tabs>
              <base-select
                v-if="!editParams"
                :value="placement"
                class="FieldPlacement"
                label="Разместить в"
                @input="placement = $event.target.value"
              >
                <div slot="item" value="Домашняя">Домашняя</div>
                <div
                  v-if="curPath !== ''"
                  slot="item"
                  :value="curPath"
                  v-text="curPath"
                />
              </base-select>
            </div>

            <!-- COMMENTED FOR FUTURE -->

            <!-- <div slot="tab" tab-name="Существующий">
              <base-input
                class="FieldInputSearch"
                label="Выберете элемент"
                placeholder="Поиск элемента"
              >
                <span slot="icon-right" class="FontIcon name_searchSmall size_lg"></span>
              </base-input>
              <div class="FolderWrapper">
                <base-expander
                  v-for="f in 3"
                  :key="`folder-${f}`"
                  theme="theme_iconLeft"
                  class="FieldExpander"
                >
                  <div slot="summary">Папка
                    <base-checkbox class="checkAllExpander"></base-checkbox>
                  </div>
                  <div class="ChooseFolder text_small">
                    <span>Дашборд</span>
                    <base-checkbox></base-checkbox>
                  </div>
                  <div class="ChooseFolder text_small">
                    <span>Дашборд</span>
                    <base-checkbox></base-checkbox>
                  </div>
                </base-expander>
                <div v-for="d in 4" :key="`dash-${d}`" class="ChooseFolder">
                  <span>Дашборд</span>
                  <base-checkbox></base-checkbox>
                </div>
              </div>
            </div> -->

            <div slot="tab" tab-name="Импортировать">
              <base-file-loader
                class="LoadImage"
                label="Загрузить дашборд"
                droppable
                accept=".json"
                description="Загрузить файл дашборда в формате JSON"
                :disabled="editParams"
                @input="handleFile"
              >
                <span slot="icon" class="FontIcon name_fileBlankOutline size_lg"></span>
              </base-file-loader>
            </div>

          </base-tabs>
        </section>

        <footer class="ModalFooter">
          <base-button theme="theme_secondary" @click="close">
            Отменить
          </base-button>
          <base-button @click="save">
            Cохранить
          </base-button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
import icons from './../utils/elementIcons';
import colors from './../utils/elementColors';

export default {
  name: 'ModalWindow',
  props: {
    curPath: { type: String, default: '' },
    editParams: { type: Object, default: null },
  },
  data: () => ({
    title: '',
    description: '',
    backgroundMode: 'Сплошной',
    iconList: icons,
    colorList: colors,
    mainColor: 0,
    secondColor: 0,
    icon: 0,
    placement: 'Домашняя',
    isFolder: false,
    isEditMode: false,
    selectedActionTab: '',
    uploadedFile: null,
  }),
  computed: {
    mainColorSelectTitle() {
      const title = 'Выберите цвет';
      return this.backgroundMode === 'Сплошной' ? title : `${title} #1`;
    },

    windowTItle() {
      return `${this.isEditMode ? 'Изменить' : 'Новый'} элемент`;
    },
  },
  mounted() {
    this.placement = this.curPath === '' ? 'Домашняя' : this.curPath;

    if (!this.editParams) return;

    const { title, description, icon, color } = this.editParams;
    this.title = title;
    this.description = description;
    this.icon = icon;

    if (this.editParams.is_dir) {
      this.isFolder = true;
      this.$nextTick(() => {
        this.$refs.elemType.activeTab = 1;
      });
    }

    if (this.editParams.isEditMode) {
      this.isEditMode= true;
      this.$nextTick(() => {
        this.$refs.elemType.isNavbarVisible = false;
        this.$refs.createModeType.isNavbarVisible = false;
      });
    }

    if (color) {
      this.mainColor = color[0];
      if (color.length > 1) {
        this.secondColor = color[1];
        this.backgroundMode = 'Градиент';
      }
    }

  },
  methods: {
    close() {
      this.$emit('close');
    },

    saveEdited() {
      if (this.title === '') {
        alert('Название не может быть пустым');
        return;
      }

      const { title, description, isFolder, curPath } = this;
      const data = { title, description, isFolder, curPath };

      if (!isFolder) {
        const { mainColor, secondColor, icon } = this;
        const isFill = this.backgroundMode === 'Сплошной';
        data.icon = icon;
        data.color = isFill ? [mainColor] : [mainColor, secondColor];
      }

      this.$emit('editElement', data);
      this.close();
    },

    saveNew() {
      if (this.selectedActionTab === 'Импортировать') {
        if (this.uploadedFile) {
          this.$emit('importElement', {
            path: this.curPath,
            file: this.uploadedFile,
          });
        }
        return this.close();
      }

      if (this.title === '') {
        alert('Название не может быть пустым');
        return;
      }

      const { title, description, mainColor, secondColor, icon, isFolder, placement } = this;

      const color = this.backgroundMode === 'Сплошной'
        ? [mainColor]
        : [mainColor, secondColor];

      const path = placement === 'Домашняя' ? '' : placement;

      const data = { title, description, color, icon, isFolder, path };

      this.$emit('createElement', data);
      this.close();
    },

    save() {
      this.editParams ? this.saveEdited() : this.saveNew();
    },

    actionTabSelectHandler(event) {
      const { tabName } = event.target.activeTab;
      this.selectedActionTab = tabName;
    },

    elemTypeTabSelectHandler(event) {
      const { tabIndex } = event.target.activeTab;
      this.isFolder = !!tabIndex;
    },

    handleFile(event) {
      if (event.target.value.length <= 0) return;
      const [file] = event.target.value;
      this.uploadedFile = file;
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
  font-family: 'Proxima Nova';
  background-color: rgba(0, 0, 0, .5);

  &,
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  .ModalWindow {
    display: grid;
    grid-template-rows: auto 1fr auto;
    position: relative;
    max-height: 700px;
    width: 520px;
    min-width: 360px;
    margin: 10px;
    background-color: var(--background_main);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: 1px 1px 2px rgba(8, 18, 55, 0.12), 0px 4px 12px rgba(8, 18, 55, 0.12);

    .ModalHeader,
    .ModalFooter {
      display: flex;
      padding: 0 30px;
    }

    .ModalHeader {
      position: relative;
      justify-content: space-between;
      align-items: center;
      padding-top: 15px;
      padding-bottom: 8px;
    }

    .ButtonClose {
      display: flex;
      border: none;
      cursor: pointer;
      background: transparent;
      padding: 0;
      color: var(--border);
    }

    .ModalBody {
      overflow: auto;
      padding: 0 30px;
    }

    .FormField {
      margin-bottom: 12px;
      overflow: auto;
    }

    .ItemLabel {
      font-size: 11px;
      color: var(--text_main);
      padding-bottom: 4px;
      font-weight: 600;
    }

    .FieldName,
    .SelectBackground {
      padding-bottom: 12px;
    }

    .FieldDescription {
      padding-bottom: 4px;
    }

    .SectionChoice {
      display: flex;
      justify-content: space-between;
    }

    .SelectColor,
    .SelectIcon {
      background-color: var(--border_secondary);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
      row-gap: 10px;
      margin-bottom: 12px;
      column-gap: 15px;
      align-items: center;
    }

    .SelectColor {
      column-gap: 18.5px;
    }

    .SelectIcon {
      column-gap: 15px;

      .Icon {
        color: var(--text_main);
        cursor: pointer;

        &.selected {
          color: var(--button_primary);
        }
      }
    }

    .ColorBox {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      position: relative;
      cursor: pointer;

      .Icon {
        display: none;
        color: var(--general_white);
      }

      &.selected {
        border: 2px solid var(--general_white);

        .Icon {
          display: block;
        }
      }
    }

    .FieldPlacement {
      padding-bottom: 16px;
    }

    .LoadImage {
      height: 97px;
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
      color: var(--border);
    }

    .FieldInputSearch {
      .FontIcon {
        color: var(--text_secondary);
      }
    }

    .FieldExpander {
      position: relative;
      padding-bottom: 6px;
    }

    .checkAllExpander {
      position: absolute;
      right: 0;
      top: 0;
    }

    .FolderWrapper {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--border);
      border-radius: 4.44px;
      margin-top: 4px;
      background-color: var(--border_12);
      padding: 10px 2px 10px 12px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 16px
    }

    .ChooseFolder {
      display: flex;
      justify-content: space-between;
      padding-bottom: 8px;
      padding-left: 28px;
      color: var(--text_main);

      &.text_small {
        font-size: 11px;
        color: var(--text_secondary);
      }
    }

    .ModalFooter {
      margin-top: auto;
      justify-content: flex-end;
      gap: 20px;
      padding-top: 10px;
      padding-bottom: 15px;
    }
  }
}
</style>
