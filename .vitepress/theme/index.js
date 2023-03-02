import './style.css'

import DefaultTheme from 'vitepress/theme'
// import LayoutSlot from "./LayoutSlot.vue";

export default {
    ...DefaultTheme,
    // override the Layout with a wrapper component that
    // injects the slots
    // Layout: LayoutSlot
}