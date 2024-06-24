<script setup lang="ts">

</script>

<!-- === -->
<template>
  <div class="logo-button">
    <span>Shogi&nbsp;Time</span>
    <img 
      src="../../../public/branding/logo-icon.png"
    /> 
  </div>
</template>

<!-- === -->
<style>
.logo-button{
  color: red;
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
