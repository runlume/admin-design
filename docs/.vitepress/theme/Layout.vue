<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import BrandWordmark from './BrandWordmark.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <!-- 首页 hero 的品牌位：字标放在标题上方，与控制台首页保持一致。 -->
    <template #home-hero-info-before>
      <!-- 字标点进官网；文档留在原标签页，外部站点新窗口打开。 -->
      <a
        class="brand-hero-link"
        href="https://runlume.app"
        target="_blank"
        rel="noreferrer"
        aria-label="Runlume 官网"
      >
        <BrandWordmark class="brand-hero" />
      </a>
    </template>
  </DefaultTheme.Layout>
</template>
