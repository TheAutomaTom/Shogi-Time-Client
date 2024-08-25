<script setup lang="ts">
import { useAppState } from '@/State/AppState';

const app$ = useAppState();

</script>

<!-- === -->
<template>
  <h1 class="logo-button">
    <span>
      <span v-if="!app$.Layout$.DrawerIsOpen">☰&nbsp;Shogi&nbsp;Time</span>
      <span v-if="app$.Layout$.DrawerIsOpen">Shogi&nbsp;Time</span>      
    </span>
    <img src="/branding/logo-icon.png"/> 
  </h1>
</template>

<!-- === -->
<style>
.logo-button{  
  white-space: nowrap;
  padding-right: 1em;
}

.logo-button span:hover{
  color: red;
}


.logo-button span{
  color:goldenrod;
  font-size: xx-large;
  vertical-align:baseline;
  font-variant: small-caps;
  
}

.logo-button img{
  height:2em;
  margin-bottom: -6px;
  margin-left: 3px;
}

.hamburger{
  color: white;
}
.hamburger:hover{
color: gold;
}

</style>
