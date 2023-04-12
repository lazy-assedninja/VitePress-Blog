<script setup lang="ts">
import type {Post} from './blog.data.js'

const props = defineProps<{ date: Post['date'] }>()

function getDateTime() {
  return new Date(props.date.time).toISOString()
}
</script>

<template>
  <dl>
    <dd class="text-base leading-6 font-medium">
      <time :datetime="getDateTime()">{{ date.string }}</time>
    </dd>
  </dl>
</template>
