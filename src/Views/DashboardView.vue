<script setup lang="ts">
</script>
<template>
  <div class="readme">
    <h2>Beta 240806</h2>
    
    <br/>

    <div class="indent">
      
      
      <h3>Notes to play and code by</h3>
      <div class="indent">
        <h5>On their turn a player must choose to Move or Drop one of their pieces as described by the following criteria:</h5>
        <br/>   
        <div class="indent">  
          <h4 class="highlighted">Move a piece of their own on the board, then possibly promote it...</h4>
          <div class="indent">
            <ul class="indent">
              <li>👉 If a piece moves into, out of, or within the promotion zone (your opponent's 3 starting rows), it may be promoted at the end of that turn.</li>
              <li>👉 if a piece moves all the way to the other side of the board, and no longer has any legal moves, it must be promoted immediately.</li>
            </ul>
          </div>        
        
        <br/>      
          
          <h4 class="highlighted">Drop a piece they have previously captured...</h4>
          <div class="indent">
            <ul>
              <li><h4 class="highlighted">Dropped pieces...</h4></li>
                <ul class="indent">
                  <li>🤏 Are always basic (un-promoted) versions of the piece.</li>
                  <li>✖️ Cannot be dropped where it will have no legal next moves (such as a pawn at the far edge of the board)</li>
                  <li>✖️ Cannot be promoted on the turn they are dropped.</li>
                </ul>

              <li><h4 class="highlighted">Pawns...</h4></li>
                <ul class="indent">
                  <li>✖️ Cannot be dropped onto files (columns) already containing one of your own un-promoted pawns.  <em>If not open files exist, captured pawn icons will appear dimmed.</em></li>
                  <li>✖️ Cannot be dropped into immediate checkmate.</li>
                </ul>
    
            </ul>
          </div>

        </div>        
      </div>
    
    </div>
    
    <br/>

    <div class="indent">
      <h3>Todos & Bug Tracking</h3>

      <br/>
      <div class="indent">
        <h4 class="highlighted">Gameplay</h4>
        <p class="indent">🔬 Detecting checkmate needs is disabled in lue of literally killing the king (or the concede button), pending further testing on checkmate conditions.</p>
        <p class="indent">🐞 When a knight has the king in check, pawns are allowed to drop onto the knight's alternative move target. No drop can block a knight's check, and is not legal.</p>
      </div>
      <br/>      
      <div class="indent">
        <h4 class="highlighted">Networking</h4>
        <p class="indent">💸Until a self-hosted (free) option is functioning, the Api's log in and remote-versus features will not be live.  The app can be used by sharing a single device for local thrills.</p>
      </div>
      <br/>
      <div class="indent">
        <h4 class="highlighted">Report a problem</h4>
        <p class="highlighted"><a href="mailto:TheAutomaTom@gmail.com?subject=Shogi Time bug report&body=Howdy, I see something fishy go'n on!" target="_blank">🥷🏼 Submit a new bug</a></p>
      </div>
    </div>
    
    <br/>
    <div div class="indent">
    <h3>Thanks for Free Resources in Use </h3>
      <div class="indent">
        <p class="indent">♟️ <a href="https://github.com/WandererXII/lishogi/blob/master/public/piece" target="_blank">Game Piece images</a></p>
      </div>      
    </div>

    <br/>

    <div class="indent">
      <h3>About the Codebase</h3>
      <div class="indent">
        <p class="indent">🎨 <a href="https://github.com/TheAutomaTom/Shogi-Time-Client" target="_blank">PWA Client in Vue 3</a></p>
        <p class="indent">🌐 <a href="https://github.com/TheAutomaTom/Shogi-Time-Api" target="_blank">Api in .Net 8 & Keycloak 24</a></p>
      </div>
    </div>

    <br/>

    <div class="indent">
      <h3>About the Author: <span class="highlighted">Tom Grossi</span></h3>
      <div class="indent">
        <p class="indent"><a href="https://github.com/TheAutomaTom" target="_blank">🐙 Github</a></p>
        <p class="indent"><a href="https://www.SurrealityCheck.org/resume.pdf" target="_blank">📜 Resume</a></p>
        <p class="indent"><a href="mailto:TheAutomaTom@gmail.com?subject=Seeking new talent!&body=Howdy, We'd love to chat about Shogi Time and our upcoming dev projects!" target="_blank">📬 Contact</a></p>
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

a {
  color:white;
  text-decoration: none;  
}
a:hover{
  color:cyan;
}


</style>