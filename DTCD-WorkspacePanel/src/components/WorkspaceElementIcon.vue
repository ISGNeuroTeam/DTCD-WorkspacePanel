<template>
  <div class="IconWrapper" :style="iconStyle">
    <div v-if="isFolder" class="Icon" v-html="folderIcon"/>
    <span v-else :class="['FontIcon size_3xl Icon', iconClass]"></span>
  </div>
</template>

<script>
import elementSizes from './../utils/elementSizes';
import elementIcons from './../utils/elementIcons';
import elementColors from './../utils/elementColors';
import folderIcons from './../utils/icons/folderIcons';

export default {
  name: 'WorkspaceElementIcon',
  props: {
    size: { type: String, default: 'medium' },
    isFolder: { type: Boolean, default: false },
    colors: { type: Array, default: () => [0] },
    icon: { type: Number, default: 0 },
  },
  computed: {
    background() {
      return this.isFolder ? 'none' : `linear-gradient(to bottom right, ${this.mainColor}, ${this.secondColor})`;
    },

    iconStyle() {
      const width = `${this.iconSize}px`;
      const borderRadius = `${this.iconRadius}px`;
      return { borderRadius, width, height: width, background: this.background };
    },

    iconClass() {
      return elementIcons[this.icon];
    },

    iconSize() {
      return elementSizes[this.size].size;
    },

    iconRadius() {
      return elementSizes[this.size].radius;
    },

    folderIcon() {
      return folderIcons[this.size];
    },

    mainColor() {
      return elementColors[this.colors[0]] || elementColors[0];
    },

    secondColor() {
      return this.colors.length < 2
        ? this.mainColor
        : elementColors[this.colors[1]] || elementColors[0];
    },
  },
};
</script>

<style lang="sass" scoped>
.IconWrapper
  display: flex
  align-items: center
  justify-content: center

  .Icon
    display: flex
    color: var(--background_main)
</style>
