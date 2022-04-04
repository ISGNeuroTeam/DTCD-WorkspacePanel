<template>
  <div class="icon-wrapper">
    <svg class="icon-back" :width="iconSize" :height="iconSize" :viewBox="viewBox" fill="none">
      <rect width="100%" height="100%" :rx="iconRadius" :fill="backFill"/>
      <defs>
        <linearGradient id="g" :x1="iconSize" :y1="iconSize" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop stop-color="#6DA8FF"/>
          <stop stop-color="#2B80FF" offset="1"/>
        </linearGradient>
      </defs>
    </svg>
    <div v-if="isFolder" class="icon-content" v-html="folderIcon"/>
    <svg v-else class="icon-content" width="52" height="52" viewBox="0 0 52 52" fill="none">
      <path d="M8.66683 47.6667H4.3335V4.33337H8.66683V47.6667ZM32.5002 45.5H10.8335V39H32.5002V45.5ZM39.0002 34.6667H10.8335V28.1667H39.0002V34.6667ZM45.5002 23.8334H10.8335V17.3334H45.5002V23.8334ZM28.1668 13H10.8335V6.50004H28.1668V13Z" fill="white"/>
    </svg>
  </div>
</template>

<script>
import elementSizes from './../utils/elementSizes';
import folderIcons from './../utils/icons/folderIcons';

export default {
  name: 'WorkspaceElementIcon',
  props: {
    size: { type: String, default: 'medium' },
    isFolder: { type: Boolean, default: false },
  },
  computed: {
    viewBox() {
      return `0 0 ${this.iconSize} ${this.iconSize}`;
    },

    backFill() {
      return this.isFolder ? 'none' : 'url(#g)';
    },

    iconSize() {
      return elementSizes[this.size].size;
    },

    iconRadius() {
      return elementSizes[this.size].radius;
    },

    folderIcon() {
      return folderIcons[this.size];
    }
  },
};
</script>

<style lang="sass" scoped>
.icon-wrapper
  position: relative

  .icon-back
    display: block

  .icon-content
    display: flex
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
</style>
