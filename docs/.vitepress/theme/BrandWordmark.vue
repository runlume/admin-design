<script setup lang="ts">
/**
 * 品牌字标：直接把 public/brand 里的字标内联渲染，
 * 只有内联才能给字标末尾的方点挂上和控制台一致的呼吸动画。
 * 文件本身用 var(--foreground) / var(--brand) 上色，深浅模式靠 CSS 变量切换。
 */
import wordmark from '../../../public/brand/wordmark-light.svg?raw'
</script>

<template>
  <span class="brand-wordmark" aria-hidden="true" v-html="wordmark" />
</template>
