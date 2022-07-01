<template>
  <div class="icon-wrapper">
    <svg class="icon-back" :width="iconSize" :height="iconSize" :viewBox="viewBox" fill="none">
      <rect width="100%" height="100%" :rx="iconRadius" :fill="backFill"/>
      <defs>
        <linearGradient id="g" :x1="iconSize" :y1="iconSize" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop :stop-color="secondColor"/>
          <stop :stop-color="mainColor" offset="1"/>
        </linearGradient>
      </defs>
    </svg>
    <div v-if="isFolder" class="icon-content" v-html="folderIcon"/>
    <span v-else :class="['icon-content FontIcon size_3xl', iconClass]"></span>
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
    viewBox() {
      return `0 0 ${this.iconSize} ${this.iconSize}`;
    },

    backFill() {
      return this.isFolder ? 'none' : 'url(#g)';
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
      return elementColors[this.colors[0]];
    },

    secondColor() {
      return this.colors.length < 2
        ? this.mainColor
        : elementColors[this.colors[1]];
    },
  },
};
</script>

<style lang="sass" scoped>
.icon-wrapper
  position: relative

  .FontIcon
    color: var(--background_main)

  .icon-back
    display: block

  .icon-content
    display: flex
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
</style>
