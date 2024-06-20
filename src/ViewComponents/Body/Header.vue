<script setup lang="ts">
import { useAppState } from "../../State/AppState.ts";
const app$ = useAppState();
</script>
<template>
  
  <div class="header">


<!-- 
    <div class="header-left debug-border">
      <button 
      class="icon-button ghost-button"
        @click="app$.Layout.ToggleDrawer()"
        >🍔</button>
      <img 
        src="../../../public/branding/logo-wide.png"
        style="height:100%"
      />
    </div> 
-->


    <div class="header-left">
      <button 
        class="header-flex-button"
        @click="app$.Layout.ToggleDrawer()"
        >
          👈
          <img 
            src="../../../public/branding/logo-wide.png"
            style="height:100%"
          /> 
      </button>
    </div>


    <div class="header-right debug-border">
      <button class="icon-button ghost-button" disabled>...</button>
      <button class="icon-button ghost-button" >...</button>
      <button class="icon-button ghost-button" >...</button>
    </div>

  </div>
</template>
<style scoped lang="scss">


.header-left{  
  grid-row:2;
  display: flex;
}


.header-flex-button{
  display: flex;
  height:100%;  
  max-width:220px;
  font-size:xx-large;
  background-color: transparent;
  border: none;
  
  align-items:flex-end; //vert

  border-radius: 50%;


}
.header-flex-button:hover{
  box-shadow:
    -12px -5px 5px rgb(65, 46, 0),
    12px 5px 5px goldenrod; 
}
.header-flex-button:active{
  box-shadow:
    -12px -5px 5px rgb(53, 14, 0),
    12px 5px 5px rgb(86, 23, 0); 
}


.ghost-button:hover{
  background-color: grey;
  opacity: 20%;
}
.ghost-button:active{
  background-color: grey;
  opacity: 50%;
}
  
.ghost-button{
  background-color: transparent;
  border: none;
  color:white;
  height:100%;
}

.header{  
  grid-row:2;
  grid-column:3;
  display: flex;
}

// .header-left{
//   height:100%;
//   width:12em;
//   display: flex;
//   flex-direction: row;
//   align-items:center;  
// }

.header-right{
  height:100%;
  width:100%;
  display: flex;
  flex-direction: row-reverse;
  align-items:center;
}

.header-link{
  padding:0 1em;
}

.header-button{
  height:100%;
  
}

</style>
