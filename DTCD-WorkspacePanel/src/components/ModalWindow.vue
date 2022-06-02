<template>
  <transition name="modal-fade">
    <div class="ModalBackdrop">
      <div class="ModalWindow">
        <header class="ModalHeader">
          <base-heading theme="theme_subheaderSmall">
            <h1>Новый элемент</h1>
          </base-heading>
          <button 
            type="button" 
            class="ButtonClose" 
            @click="close"
          >
            <span class="FontIcon name_closeBig size_lg"></span> 
          </button>
        </header>

        <section class="FormField">
          <span class="ItemLabel">Добавить элемент</span>
          <base-tabs>
            <div slot="tab" tab-name="Новый">
              <span class="ItemLabel">Тип элемента</span>
              <base-tabs>
                <div slot="tab" tab-name="Дашборд">
                  <base-input 
                    class="FieldName" 
                    label="Название (23 знака)" 
                    placeholder="Введите название"
                  >
                  </base-input>
                  <base-textarea 
                    theme="resize_off" 
                    class="FieldDescription" 
                    label="Описание (200 знака)" 
                    placeholder="Введите описание"
                  >
                  </base-textarea>
                  <span class="ItemLabel">Приватность</span>
                  <base-tabs>
                    <div slot="tab" tab-name="Общий"></div>
                    <div slot="tab" tab-name="Личный"></div>
                  </base-tabs>
                  <base-select 
                    class="SelectBackground" 
                    label="Фон элемента"
                  >
                    <div slot="item" value="Сплошной">Сплошной</div>
                    <div slot="item" value="Градиент">Градиент</div>
                  </base-select>
                  
                  <div class="SectionChoice">
                    <span class="ItemLabel">Выберете цвет</span>
                    <base-button 
                      theme="theme_alfa" 
                      size="small"
                    >Свой цвет
                      <span slot="icon-left" class="FontIcon name_colorPicker"></span>
                    </base-button>
                  </div>
                  <div class="SelectColor">
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                  </div>

                  <!-- <div class="SectionChoice">
                    <span class="ItemLabel">Выберете цвет #1</span>
                    <base-button 
                      theme="theme_alfa" 
                      size="small"
                    >Свой цвет
                      <span slot="icon-left" class="FontIcon name_colorPicker"></span>
                    </base-button>
                  </div>
                  <div class="SelectColor">
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                  </div>

                  <div class="SectionChoice">
                    <span class="ItemLabel">Выберете цвет #2</span>
                    <base-button 
                      theme="theme_alfa" 
                      size="small"
                    >Свой цвет
                      <span slot="icon-left" class="FontIcon name_colorPicker"></span>
                    </base-button>
                  </div>
                  <div class="SelectColor">
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                    <button class="ColorBox"><span class="ColorIcon FontIcon name_check size_lg"></span></button>
                  </div> -->

                  <div class="SectionChoice">
                    <span class="ItemLabel">Выберете иконку</span>
                    <base-button 
                      theme="theme_alfa" 
                      size="small"
                    >Загрузить свою
                      <span slot="icon-left" class="FontIcon name_download"></span>
                    </base-button>
                  </div>
                  <div class="SelectIcon">
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_heartOutline size_lg"></span>
                    </button> 
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_tagOutline size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_calendar size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_infoCircleOutline size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_searchSmall size_xl"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_folder size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_copy size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_notificationOutline size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_table size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_cloudOutline size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_idCard size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_pieChartOutline size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_barChartAlt size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_barChartSquare size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_fileFind size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_show size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_mention size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_user size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_lineChartDown size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_chatAlt size_lg"></span>
                    </button> 
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_terminal size_lg"></span>
                    </button> 
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_warningOutline size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_addRow size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_gridHorizontalRound rotate_270 size_lg"></span>
                    </button>  
                    <button class="IconWrapper">
                      <span class="Icon FontIcon name_barBottom size_lg"></span>
                    </button>  
                  </div>
                  <base-select 
                    class="FieldPlacement" 
                    label="Разместить в"
                  >
                    <div slot="item" value="Домашняя">Домашняя</div>
                  </base-select>
                </div>

                <div slot="tab" tab-name="Папка">
                  <base-input 
                    class="FieldName" 
                    label="Название (23 знака)" 
                    placeholder="Введите название"
                  >
                  </base-input>
                  <base-textarea 
                    theme="resize_off" 
                    class="FieldDescription" 
                    label="Описание (200 знака)" 
                    placeholder="Введите описание"
                  >
                  </base-textarea>
                  <span class="ItemLabel">Приватность</span>
                  <base-tabs>
                    <div slot="tab" tab-name="Общий"></div>
                    <div slot="tab" tab-name="Личный"></div>
                  </base-tabs>
                  <base-select 
                    class="FieldPlacement" 
                    label="Разместить в"
                  >
                    <div slot="item" value="Домашняя">Домашняя</div>
                  </base-select>
                </div>
              </base-tabs>
              <div class="ModalFooter">
                <base-button 
                  type="button" 
                  theme="theme_secondary" 
                  class="ButtonClose"
                  @click="close"
                >Отменить
                </base-button>
                <base-button 
                  type="button" 
                  @click="save"
                >Cохранить
                </base-button>
              </div>
            </div>

            <div slot="tab" tab-name="Существующий">
              <base-input 
                class="FieldInputSearch"
                label="Выберете элемент" 
                placeholder="Поиск элемента"
              >
                <span slot="icon-right" class="FontIcon name_searchSmall size_lg"></span>
              </base-input>
              <div class="FolderWrapper">
                <base-expander 
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
                <base-expander 
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
                <div class="ChooseFolder">
                  <span>Дашборд</span>
                  <base-checkbox></base-checkbox>
                </div>
                <div class="ChooseFolder">
                  <span>Дашборд</span>
                  <base-checkbox></base-checkbox>
                </div>
                <div class="ChooseFolder">
                  <span>Дашборд</span>
                  <base-checkbox></base-checkbox>
                </div>
                <div class="ChooseFolder">
                  <span>Дашборд</span>
                  <base-checkbox></base-checkbox>
                </div>
              </div>
              <div class="ModalFooter">
                <base-button 
                  type="button" 
                  theme="theme_secondary" 
                  class="ButtonClose"
                  @click="close"
                >Отменить
                </base-button>
                <base-button 
                  type="button" 
                  @click="save"
                >Добавить
                </base-button>
              </div>
            </div>

            <div slot="tab" tab-name="Импортировать">
              <base-file-loader
                class="LoadImage"
                label="Загрузить дашборд"
                description="Загрузить файл дашборда"
                accept=".jpg, .jpeg, .png"
                @input="handlePhoto($event)"
              >
                <span slot="icon" class="FontIcon name_fileBlankOutline size_lg"></span>
              </base-file-loader>
              <div class="ModalFooter">
                <base-button 
                  type="button" 
                  theme="theme_secondary" 
                  class="ButtonClose"
                  @click="close"
                >Отменить
                </base-button>
                <base-button 
                  type="button" 
                  @click="save"
                >Добавить
                </base-button>
              </div>
            </div>
          </base-tabs>
        </section>
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
  font-family: 'Proxima Nova';

  &,
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }  

  .ModalWindow {
    display: flex;
    flex-direction: column;
    position: relative;
    height: auto;
    max-height: 80vh;
    width: 520px;
    min-width: 360px;
    overflow-y: auto;
    z-index: 30;
    padding: 15px 30px 0;
    margin: 10px;
    background-color: var(--background_main);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: 1px 1px 2px rgba(8, 18, 55, 0.12), 0px 4px 12px rgba(8, 18, 55, 0.12);

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
    }

    .FormField {
      margin-bottom: 12px;
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
    }

    .ColorBox {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background-color: var(--aero);
      cursor: pointer;
      position: relative;
      border: none;

      &:active {
        border: 2px solid var(--general_white);
      }

      &:nth-child(2) {
        background-color: var(--navi);
      }

      &:nth-child(3) {
        background-color: var(--brown);
      }

      &:nth-child(4) {
        background-color: var(--orange);
      }

      &:nth-child(5) {
        background-color: var(--yellow);
      }

      &:nth-child(6) {
        background-color: var(--mint);
      }

      &:nth-child(7) {
        background-color: var(--teal);
      }

      &:nth-child(8) {
        background-color: var(--cyan);
      }

      &:nth-child(9) {
        background-color: var(--indigo);
      }

      &:nth-child(10) {
        background-color: var(--purple);
      }

      &:nth-child(11) {
        background-color: var(--pink);
      }

      .ColorIcon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;

        &:active {
          opacity: 1;
        }
      }
    }

    .IconWrapper {
      width: 24px;
      height: 24px;
      position: relative;
      border: none;
      background-color: transparent;

      .Icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        &:hover {
          color: var(--button_primary);
        }

        &:active {
          color: var(--button_primary);
        }
      }
    }

    .FontIcon {
      color: var(--text_main);
      cursor: pointer;
      
      &.name_closeBig:before {
        color: var(--border);
      }

      &.name_colorPicker:before,
      &.name_download:before {
        color: var(--button_primary);
      }

      &.name_fileBlankOutline:before {
        color: var(--text_secondary);
      }

      &.name_check:before {
        color: var(--general_white);
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
      padding-top: 10px;

      .ButtonClose {
        padding-right: 10px;
      }
    }
  }
}
</style>