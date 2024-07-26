# Shogi Time

## References

- https://tailwindcss.com/docs/guides/vite

## Opens source resources

- Piece images: https://github.com/WandererXII/lishogi/blob/master/public/piece

## Rules notes

- On a turn, a player may 
  - Move 1 piece, then possibly promote it.
    - If a piece moves into, out of, or within the promotion zone (your opponent's 3 starting rows), it may be promoted at the end of that turn.
    - if a piece moves all the way to the other side of the board, and no longer has any legal moves, it must be promoted immediately.
  - Drop 1 captured piece:
    - Dropped pieces... 
      - Are always basic (un-promoted) versions of the piece.
      - Cannot be dropped where it will have no legal next moves (such as a pawn at the far edge of the board)
      - Are not to be promoted on the turn they are dropped.
    - Pawns... 
      - Cannot be dropped onto columns already containing one of your own un-promoted pawns.
      - Cannot be dropped into immediate checkmate.
    
## Game lifecycle

- LoadingBoard

- TurnStart
  Marks the first opportunity the new current player may begin making selections.

- MoveStart
  The current player has selected a piece on the board.  Selecting another one of their pieces on the board maintains this phase.  Selecting a piece form their captures triggers a DropStart phase.
  Selection assigns the MoveOrigin square, which is watched for board highlight class updates.

- DropStart
  The current player has selected a piece from their captures.  Selecting another one of their captured pieces maintains this phase.  Selecting a piece form the board triggers a MoveStart phase.

- MoveEnd
  Transition concluding a MoveStart or DropStart phase.

- PromoteOption

- GameOver
