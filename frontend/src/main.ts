import { createApp } from 'vue'
import App from './App.vue'
import { VueQueryPlugin } from "vue-query";
import { createPinia } from 'pinia'

const pinia = createPinia()

createApp(App).use(VueQueryPlugin).use(pinia).mount('#app')
