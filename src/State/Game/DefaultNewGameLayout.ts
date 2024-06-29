import { GamePieceModel, GamePieceType, GameSquareModel } from "@/Models/Game";

export class DefaultNewGameLayout {
Squares = [

  // Player 1: Back Row /==================
    new GameSquareModel( 1, 9, false, new GamePieceModel( 1, GamePieceType.Lance, "Left", "0KY")),
    new GameSquareModel( 2, 9, false, new GamePieceModel( 1, GamePieceType.Knight, "Left", "0KE")),
    new GameSquareModel( 3, 9, false, new GamePieceModel( 1, GamePieceType.Silver, "Left", "0GI")),
    new GameSquareModel( 4, 9, false, new GamePieceModel( 1, GamePieceType.Gold, "Left", "0KI")),
    new GameSquareModel( 5, 9, false, new GamePieceModel( 1, GamePieceType.KingVictor, "Center", "0OU")),
    new GameSquareModel( 6, 9, false, new GamePieceModel( 1, GamePieceType.Gold, "Right", "0KI")),
    new GameSquareModel( 7, 9, false, new GamePieceModel( 1, GamePieceType.Silver, "Right", "0GI")),
    new GameSquareModel( 8, 9, false, new GamePieceModel( 1, GamePieceType.Knight, "Right", "0KE")),
    new GameSquareModel( 9, 9, false, new GamePieceModel( 1, GamePieceType.Lance, "Right", "0KY")),
    
    // Player 1: Mid Row /==================
    new GameSquareModel( 1, 8 ),
    new GameSquareModel( 2, 8, false, new GamePieceModel( 1, GamePieceType.Bishop, "Left", "0KA")),
    new GameSquareModel( 3, 8 ),
    new GameSquareModel( 4, 8 ),
    new GameSquareModel( 5, 8 ),
    new GameSquareModel( 6, 8 ),
    new GameSquareModel( 7, 8 ),
    new GameSquareModel( 8, 8, false, new GamePieceModel( 1, GamePieceType.Rook, "Right", "0HI")),
    new GameSquareModel( 9, 8 ),


  // Player 1: Pawn Row /==================
  new GameSquareModel( 1, 7, false, new GamePieceModel( 1, GamePieceType.Pawn, "Left", "0FU")),
  new GameSquareModel( 2, 7, false, new GamePieceModel( 1, GamePieceType.Pawn, "Left", "0FU")),
  new GameSquareModel( 3, 7, false, new GamePieceModel( 1, GamePieceType.Pawn, "Left", "0FU")),
  new GameSquareModel( 4, 7, false, new GamePieceModel( 1, GamePieceType.Pawn, "Left", "0FU")),
  new GameSquareModel( 5, 7, false, new GamePieceModel( 1, GamePieceType.Pawn, "Left", "0FU")),
  new GameSquareModel( 6, 7, false, new GamePieceModel( 1, GamePieceType.Pawn, "Right", "0FU")),
  new GameSquareModel( 7, 7, false, new GamePieceModel( 1, GamePieceType.Pawn, "Right", "0FU")),
  new GameSquareModel( 8, 7, false, new GamePieceModel( 1, GamePieceType.Pawn, "Right", "0FU")),
  new GameSquareModel( 9, 7, false, new GamePieceModel( 1, GamePieceType.Pawn, "Right", "0FU")),

  // Row F /==================
    new GameSquareModel( 1, 6 ),
    new GameSquareModel( 2, 6 ),
    new GameSquareModel( 3, 6 ),
    new GameSquareModel( 4, 6 ),
    new GameSquareModel( 5, 6 ),
    new GameSquareModel( 6, 6 ),
    new GameSquareModel( 7, 6 ),
    new GameSquareModel( 8, 6 ),
    new GameSquareModel( 9, 6 ),

  // Row E /==================
    new GameSquareModel( 1, 5 ),
    new GameSquareModel( 2, 5 ),
    new GameSquareModel( 3, 5 ),
    new GameSquareModel( 4, 5 ),
    new GameSquareModel( 5, 5 ),
    new GameSquareModel( 6, 5 ),
    new GameSquareModel( 7, 5 ),
    new GameSquareModel( 8, 5 ),
    new GameSquareModel( 9, 5 ),

  // Row D /==================
    new GameSquareModel( 1, 4 ),
    new GameSquareModel( 2, 4 ),
    new GameSquareModel( 3, 4 ),
    new GameSquareModel( 4, 4 ),
    new GameSquareModel( 5, 4 ),
    new GameSquareModel( 6, 4 ),
    new GameSquareModel( 7, 4 ),
    new GameSquareModel( 8, 4 ),
    new GameSquareModel( 9, 4 ),

  // Player 2: Pawn Row /==================
  new GameSquareModel( 1, 3, false, new GamePieceModel( 2, GamePieceType.Pawn, "9", "1FU")),
  new GameSquareModel( 2, 3, false, new GamePieceModel( 2, GamePieceType.Pawn, "8", "1FU")),
  new GameSquareModel( 3, 3, false, new GamePieceModel( 2, GamePieceType.Pawn, "7", "1FU")),
  new GameSquareModel( 4, 3, false, new GamePieceModel( 2, GamePieceType.Pawn, "6", "1FU")),
  new GameSquareModel( 5, 3, false, new GamePieceModel( 2, GamePieceType.Pawn, "5", "1FU")),
  new GameSquareModel( 6, 3, false, new GamePieceModel( 2, GamePieceType.Pawn, "4", "1FU")),
  new GameSquareModel( 7, 3, false, new GamePieceModel( 2, GamePieceType.Pawn, "3", "1FU")),
  new GameSquareModel( 8, 3, false, new GamePieceModel( 2, GamePieceType.Pawn, "2", "1FU")),
  new GameSquareModel( 9, 3, false, new GamePieceModel( 2, GamePieceType.Pawn, "1", "1FU")),
  
  // Player 2: Mid Row /==================
    new GameSquareModel( 1, 2 ),
    new GameSquareModel( 2, 2, false, new GamePieceModel( 2, GamePieceType.Rook, "Right", "1HI")),
    new GameSquareModel( 3, 2 ),
    new GameSquareModel( 4, 2 ),
    new GameSquareModel( 5, 2 ),
    new GameSquareModel( 6, 2 ),
    new GameSquareModel( 7, 2 ),
    new GameSquareModel( 8, 2, false, new GamePieceModel( 2, GamePieceType.Bishop, "Left", "1KA")),
    new GameSquareModel( 9, 2 ),

  // Player 2: Back Row /==================
    new GameSquareModel( 1, 1, false, new GamePieceModel( 1, GamePieceType.Lance, "Right", "1KY")),
    new GameSquareModel( 2, 1, false, new GamePieceModel( 1, GamePieceType.Knight, "Right", "1KE")),
    new GameSquareModel( 3, 1, false, new GamePieceModel( 1, GamePieceType.Silver, "Right", "1GI")),
    new GameSquareModel( 4, 1, false, new GamePieceModel( 1, GamePieceType.Gold, "Right", "1KI")),
    new GameSquareModel( 5, 1, false, new GamePieceModel( 1, GamePieceType.KingVictor, "Center", "1OU")),
    new GameSquareModel( 6, 1, false, new GamePieceModel( 1, GamePieceType.Gold, "Left", "1KI")),
    new GameSquareModel( 7, 1, false, new GamePieceModel( 1, GamePieceType.Silver, "Left", "1GI")),
    new GameSquareModel( 8, 1, false, new GamePieceModel( 1, GamePieceType.Knight, "Left", "1KE")),
    new GameSquareModel( 9, 1, false, new GamePieceModel( 1, GamePieceType.Lance, "Left", "1KY")),
  
  ] // ...Squares
};