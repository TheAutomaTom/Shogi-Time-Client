<script setup lang="ts">
import Header from "@Components/Body/Header.vue";
import { useAppState } from "./State/AppState";

const app$ = useAppState();

const getDrawerClass = () => {
  console.log(app$.Layout.DrawerIsOpen ? 'drawer-open' : 'drawer-shut');
  return app$.Layout.DrawerIsOpen ? 'drawer-open' : 'drawer-shut';
}
</script>

<template>
  <!--==== Drawer =======================================================-->
  <div 
    class="drawer"
    :class="getDrawerClass()"
  >

    <div class="drawer-header">
      <button 
        class="flex-button"
        @click="app$.Layout.ToggleDrawer()"
        >
          👈
          <img 
            src="../../../public/branding/logo-wide.png"
            style="height:100%"
          /> 
      </button>
    </div>

    <div class="drawer-content">
      <button class="drawer-button"><span>🫵 One</span></button>
      <button class="drawer-button"><span>🫡 Two</span></button>
      <button class="drawer-button"><span>🎼 Three</span></button>
      <button class="drawer-button"><span>🎠 Four</span></button>
    </div>

  </div>

  <!--==== App-Container ================================================-->
  <div id="root" class="app-container">

    <!--==== Header Ad ==================================================-->
    <div style="grid-row:1;grid-column:2/5;background-color: purple;">
    </div>

    <div style="grid-row:1/6;grid-column:1;background-color: magenta;">
    </div>

    <div style="grid-row:2/5;grid-column:2;background-color: blue;">
    </div>
    
    <!--==== Header =====================================================-->
    <Header></Header>

    <!--==== Content ====================================================-->
    <div class="content-wrapper debug-border">
      <div>Content</div>
    </div>
    
    <div style="grid-row:4;grid-column:3/4;background-color: lightblue;">
    </div>

    <div style="grid-row:2/5;grid-column:4;background-color: blue;">
    </div>

    <div style="grid-row:1/6;grid-column:5;background-color: magenta;">
    </div>

    <!--==== Footer Ad ==================================================-->
    <div style="grid-row:5;grid-column:2/5;background-color: purple;">
    </div>

  </div>

</template>

<style scoped lang="scss">

// .debug-border{
//   border:1px dotted grey;
// }

.app-container {
  height: 100vh;
  width:100%;
  display: grid;
  overflow: hidden;

  grid-template-rows: 0em 2.5em 1fr 2.5em 0em;
  grid-template-columns: 0em 2.5em 1fr 2.5em 0em;

  transition: 150ms;
  transition-timing-function: ease-out;
}

.content-wrapper{
  grid-row:3/4;
  grid-column:3;
  
  width:100%;
  justify-content: center;  
}

.drawer{
  position: absolute;
  z-index: 10;
  overflow: hidden;
  top:0;
  bottom:0;
  max-width:250px;
  display: grid;
  grid-template-rows: 0em 2.5em 1fr 2.5em 0em;
  
  background-color: black;
  border-right: 4px double grey;  

}
.drawer-open{
  width:100%;

}
.drawer-shut{
  width:0%;

}



.drawer-header{  
  grid-row:2;
  display: flex;
  margin-left: 1em;
}

.drawer-content{
  grid-row:3;
  max-width:250px;
  
}

.drawer-button{
  font-size:x-large;
  background-color: transparent;
  border: none;
  color: white;
  width:100%
  
}
.drawer-button:hover{
  color: goldenrod;
  
}
.drawer-button:active{
  color: gold;
}

.flex-button{
  display: flex;
  height:100%;  
  width:100%;
  font-size:xx-large;
  background-color: transparent;
  border: none;
  
  align-items:flex-end;
  margin-left:.75em;

}
.flex-button:hover{
  background-color: goldenrod;
  
}
.flex-button:active{
  background-color: yellow;
}

</style>
