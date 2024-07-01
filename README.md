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
      - Cannot be dropped for immediate checkmate.
    

