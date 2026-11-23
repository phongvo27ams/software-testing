import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import Mermaid from './Mermaid.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }: any) {
    app.component('Mermaid', Mermaid)
  }
}
