<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

const { Layout } = DefaultTheme

interface TocItem {
  id: string
  number: string
  text: string
  level: number
}

const tocItems = ref<TocItem[]>([])
let observer: MutationObserver | null = null

function extractHeadings() {
  const doc = document.querySelector('.vp-doc')
  if (!doc) return

  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4'))
  const items: TocItem[] = []
  const counters = [0, 0, 0, 0]

  headings.forEach((el, index) => {
    const text = (el.textContent || '').replace(/\u200B/g, '').replace(/#$/, '').trim()
    const id = el.getAttribute('id') || ''
    const level = Number(el.tagName.slice(1))

    // Bỏ qua tiêu đề đầu tiên nếu trùng với tên sách trên trang bìa
    if (index === 0 && level === 1 && text.toLowerCase() === 'software testing') {
      return
    }

    if (text && id) {
      counters[level - 1] += 1
      for (let i = level; i < counters.length; i++) {
        counters[i] = 0
      }

      const number = counters.slice(0, level).join('.')
      items.push({ id, number, text, level })
    }
  })

  tocItems.value = items
}

onMounted(async () => {
  await nextTick()
  extractHeadings()

  const doc = document.querySelector('.vp-doc')
  if (doc) {
    observer = new MutationObserver(() => {
      extractHeadings()
    })
    observer.observe(doc, { childList: true, subtree: true })
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <Layout>
    <template #doc-before>
      <!-- TRANG BÌA SÁCH -->
      <section class="book-cover">
        <div class="book-cover-inner">
          <div class="book-cover-top">
            <span class="book-badge">TEXTBOOK &amp; PRACTICE GUIDE</span>
          </div>

          <div class="book-cover-center">
            <h1 class="book-title">Software Testing</h1>
            <div class="book-divider"></div>
            <p class="book-subtitle">Test Design Techniques &amp; Practical Exercises</p>
          </div>

          <div class="book-cover-bottom">
            <div class="book-author-label">Author</div>
            <div class="book-author-name">Phong Vo</div>
          </div>
        </div>
      </section>

      <!-- MỤC LỤC NHƯ MỘT CUỐN SÁCH -->
      <nav v-if="tocItems.length" class="book-toc" aria-label="Mục lục">
        <div class="book-toc-header">
          <h2 class="book-toc-title">Mục lục</h2>
          <span class="book-toc-sub">Table of Contents</span>
        </div>

        <ol class="book-toc-list">
          <li
            v-for="item in tocItems"
            :key="item.id"
            :class="['book-toc-item', `toc-level-${item.level}`]"
          >
            <a :href="`#${item.id}`" class="book-toc-link">
              <span class="book-toc-num">{{ item.number }}</span>
              <span class="book-toc-text">{{ item.text }}</span>
              <span class="book-toc-dots" aria-hidden="true"></span>
            </a>
          </li>
        </ol>
      </nav>
    </template>
  </Layout>
</template>
