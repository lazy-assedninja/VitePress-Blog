<script setup>
import DefaultTheme from 'vitepress/theme'

const {Layout} = DefaultTheme
</script>

<template>
  <Layout>
    <template #aside-outline-before>
      <p><em>My custom sidebar top content</em> <br/> <br/></p>
    </template>
  </Layout>
</template>