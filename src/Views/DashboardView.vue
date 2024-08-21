<script setup lang="ts">
</script>
<template>
  <div class="readme">
    <h2>Beta 240806</h2>
    
    <br/>

    <div class="indent">
      <h3>Resources</h3>
      <div class="indent">
        <h4 class="highlighted">Open Source Piece images: </h4>
        <p class="indent">👉 https://github.com/WandererXII/lishogi/blob/master/public/piece</p>
      </div>
      
      <br/>
      
    <div class="indent">
      <h3>On a turn a player...</h3>
      <div class="indent">  
        <h4 class="highlighted">Move 1 piece, then possibly promote it...</h4>
        <div class="indent">
          <ul class="indent">
            <li>👉 If a piece moves into, out of, or within the promotion zone (your opponent's 3 starting rows), it may be promoted at the end of that turn.</li>
            <li>👉 if a piece moves all the way to the other side of the board, and no longer has any legal moves, it must be promoted immediately.</li>
          </ul>
        </div>        
      
      <br/>      
        
        <h4 class="highlighted">Drop 1 captured piece...</h4>
        <div class="indent">
          <ul>
            <li><h4 class="highlighted">Dropped pieces...</h4></li>
              <ul class="indent">
                <li>👉 Are always basic (un-promoted) versions of the piece.</li>
                <li>👉 Cannot be dropped where it will have no legal next moves (such as a pawn at the far edge of the board)</li>
                <li>👉 Are not to be promoted on the turn they are dropped.</li>
              </ul>

            <li><h4 class="highlighted">Pawns...</h4></li>
              <ul class="indent">
                <li>👉 Cannot be dropped onto files (columns) already containing one of your own un-promoted pawns.  <em>If not open files exist, captured pawn icons will appear dimmed.</em></li>
                <li>👉 Cannot be dropped into immediate checkmate.</li>
              </ul>
  
          </ul>
        </div>

      </div>        
    </div>
    
    </div>
    
  </div>
</template>
<style lang="scss">
.readme{
  width:90%;
}
.highlighted{
  color:goldenrod;
}

em {
  font-style: italic;
  color: grey;
}

</style>