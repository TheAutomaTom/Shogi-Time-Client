import "./Config/Styles/index.scss";
import App from "./App.vue";

console.log("createApp(App)"); 
import { createApp } from "vue";
const _app = createApp(App);

console.log("_app.use(createPinia())"); 
import { createPinia } from "pinia";
_app.use(createPinia());

import Router from "./Config/Router/router";
_app.use(Router);

// Controls...
// import naiveuiComponents from "./App/Views/Common/naiveui-components";
// naiveuiComponents.forEach((c) => {
//   _app.use(c.component);
// });

// import GIcon from "./App/Views/Common/GIcon.vue";
// _app.component("g-icon", GIcon);

_app.mount("#app");
