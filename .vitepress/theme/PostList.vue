<script setup lang="ts">
import Date from './Date.vue'
import {data as blog} from './blog.data.js'
</script>

<template>
  <div class="divide-y divide-gray-200 dark:divide-slate-200/5">
    <ul class="divide-y divide-gray-200 dark:divide-slate-200/5">
      <li class="py-12" v-for="{ title, href, date, description } of blog">
        <article class="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
          <Date :date="date"/>
          <div class="space-y-5 xl:col-span-3">
            <div class="space-y-6">
              <h2 class="text-2xl leading-8 font-bold tracking-tight">
                <a class="text-gray-900 dark:text-white" :href="href">{{ title }}</a>
              </h2>
              <div
                  class="prose dark:prose-invert max-w-none text-gray-500 dark:text-gray-300"
                  v-html="description"
              ></div>
            </div>
            <div class="text-base leading-6 font-medium">
              <a class="link" aria-label="read more" :href="href">Read more →</a>
            </div>
          </div>
        </article>
      </li>
    </ul>
  </div>
</template>
