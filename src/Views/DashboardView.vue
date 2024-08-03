<template>
  <div style="color:white">
    
    <h2>## Version: Open beta</h2>
    <br/>
    
    <p>
      <ul>
        <!-- <li>- https://tailwindcss.com/docs/guides/vite</li> -->
        
        
        <li>## Resources</li>
        <ul>
          <li>
            - Piece images: https://github.com/WandererXII/lishogi/blob/master/public/piece
          </li>
        </ul>

        <br/>
        <li>## Rules to code (and play) by:</li>
        <br/>
        <ul>
          
          <li>
            ### On a turn, a player may:
            
            <ul> 
              <br/>
              <li>
                &emsp; #### Move 1 piece, then possibly promote it.
                <ul>
                  <li>
                    &emsp;&emsp; - If a piece moves into, out of, or within the promotion zone (your opponent's 3 starting rows), it may be promoted at the end of that turn.
                  </li>
                  <li>
                    &emsp;&emsp; - if a piece moves all the way to the other side of the board, and no longer has any legal moves, it must be promoted immediately.
                  </li>
                </ul>
                  
                  
              </li>
              <br/>
              <li>
                &emsp;#### Drop 1 captured piece:
                <ul>
                  <li>
                    &emsp;&emsp;- Dropped pieces are always basic (un-promoted) versions.
                  </li>
                  <li>
                    &emsp;&emsp;- Cannot be dropped where it will have no legal next moves (such as a pawn at the far edge of the board).
                  </li>
                  <li>
                    &emsp;&emsp;- Are not to be promoted on the turn they are dropped.
                  </li>
                </ul>
              </li>
              <br/>  

              <li>
                &emsp;#### Pawns... 
                <ul>
                  <li>
                    &emsp;&emsp; - Cannot be dropped onto columns already containing one of your own un-promoted pawns.
                  </li>
                  <li>
                    &emsp;&emsp; - Cannot be dropped into immediate checkmate.
                  </li>
                </ul>
              </li>
              <br/>  

              <br/>              
            </ul>
            
            
          </li>

          <br/>              

          <li>

          </li>
        </ul>
  


  
    


<!--       
  ## Game lifecycle

  - `LoadingBoard`
    Sends and receives information from server.

  - `TurnStart`
    Marks the first opportunity the new current player may begin making selections from either pieces on the board or their captures.

  - `MoveStart`
    The current player has selected one of their pieces on the board.  Selecting another one of their pieces on the board maintains this phase, shifting the focus to the newly selected piece.  Selecting a piece from their captures enters a DropStart phase.  This selection assigns the MoveOrigin square, which is watched for square highlight class updates.
    Selecting a piece form their captures triggers a DropStart phase.  

  - `DropStart`
    The current player has selected a piece from their captures.  Selecting another one of their captured pieces maintains this phase.  Selecting a piece form the board triggers a MoveStart phase.

  - `MoveEnd`
    Transition concluding a MoveStart or DropStart phase.  Creates a new piece in the assigned destination, removes piece at origin, evaluates Promotion condition (possibly triggering PromotionModal).  Calls CompleteMove if PromotionModal is not triggered.

  - `PromoteOption`
    Occurs when a piece is moved into an applicable PromotionZone.  Drops are not eligible for promotion on initial placement.  Mandatory promotions do not trigger this modal.  Calls CompleteMove on close.

  - `GameOver`
    ...

  ## Turn workflow notes


  - CompleteMove -->
      </ul>
    </p>
  </div>
</template>
