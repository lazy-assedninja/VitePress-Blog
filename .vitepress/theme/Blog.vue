<script setup lang="ts">
import Date from './Date.vue'
import {data as blog} from './blog.data.js'
</script>

<template>

  <div class="antialiased">

    <main class="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0">

      <div class="VPContent divide-y divide-gray-200 dark:divide-slate-200/5">

        <ul class="divide-y divide-gray-200 dark:divide-slate-200/5">

          <li class="py-12" v-for="{ title, url, description, date } of blog">

            <article class="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">

              <Date :date="date"/>

              <div class="space-y-5 xl:col-span-3">

                <div class="space-y-6">

                  <h2 class="text-2xl leading-8 font-bold tracking-tight">

                    <a id="frontmatter-title" :href="url">{{ title }}</a>
                  </h2>

                  <div class="max-w-none" v-html="description"/>
                </div>

                <div class="text-base leading-6 font-medium">

                  <a class="link" aria-label="read more" :href="url">Read more →</a>
                </div>
              </div>
            </article>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>
