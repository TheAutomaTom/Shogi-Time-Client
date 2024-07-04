<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: 'red',
  },
});

const logoColor = `color: ${props.color}`

</script>

<!-- === -->
<template>
  <h1 
    class="logo-button"
    :style="logoColor"
  >
    <span>Shogi&nbsp;Time</span>
    <img 
      src="/branding/logo-icon.png"
    /> 
  </h1>
</template>

<!-- === -->
<style>
.logo-button{  
  white-space: nowrap;
  padding-right: 1em;
}

.logo-button:hover{
  color: goldenrod;
}

.logo-button:active{
  color: yellow;  
}

.logo-button span{
  font-size: xx-large;
  vertical-align:baseline;
  font-variant: small-caps;
  
}

.logo-button img{
  height:2em;
  margin-bottom: -6px;
  margin-left: 3px;
}

</style>
