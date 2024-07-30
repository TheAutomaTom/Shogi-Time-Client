import { GameSquareModel } from "@/State/Game/GameSquareModel";
import { PieceType } from '../Pieces/PieceType';
import { PieceModel } from "../Pieces/PieceModel";

export class TestCheckBoardSetup {
Squares = [

  // Player 1: Back Row /==================
    // new SquareModel( 1, 9, 2, new PieceModel( 1, PieceType.Lance,   "Left", "KY")),
    new GameSquareModel( 2, 9, 2, new PieceModel( 1, PieceType.Knight,  "Left", "KE")),
    // new SquareModel( 3, 9, 2, new PieceModel( 1, PieceType.Silver,  "Left", "GI")),
    // new SquareModel( 4, 9, 2, new PieceModel( 1, PieceType.Gold,    "Left", "KI")),
    // new SquareModel( 5, 9, 2, new PieceModel( 1, PieceType.KingVictor, "Center", "OU")),
    // new SquareModel( 6, 9, 2, new PieceModel( 1, PieceType.Gold,    "Right", "KI")),
    // new SquareModel( 7, 9, 2, new PieceModel( 1, PieceType.Silver,  "Right", "GI")),
    new GameSquareModel( 8, 9, 2, new PieceModel( 1, PieceType.Knight,  "Right", "KE")),
    // new SquareModel( 9, 9, 2, new PieceModel( 1, PieceType.Lance,   "Right", "KY")),
    
    new GameSquareModel( 1, 9, 2 ),
    // new SquareModel( 2, 9, 2 ),
    new GameSquareModel( 3, 9, 2 ),
    new GameSquareModel( 4, 9, 2 ),
    new GameSquareModel( 5, 9, 2 ),
    new GameSquareModel( 6, 9, 2 ),
    new GameSquareModel( 7, 9, 2 ),
    // new SquareModel( 8, 9, 2 ),
    new GameSquareModel( 9, 9, 2 ),
    
    // Player 1: Mid Row /==================
    new GameSquareModel( 1, 8, 2 ),
    
    new GameSquareModel( 2, 8, 2, new PieceModel( 1, PieceType.Bishop, "Left", "KA")),
    // new SquareModel( 2, 8, 2 ),

    new GameSquareModel( 3, 8, 2 ),
    new GameSquareModel( 4, 8, 2 ),
    new GameSquareModel( 5, 8, 2 ),
    new GameSquareModel( 6, 8, 2 ),
    new GameSquareModel( 7, 8, 2 ),
    new GameSquareModel( 8, 8, 2, new PieceModel( 1, PieceType.Rook, "Right", "HI")),
    new GameSquareModel( 9, 8, 2 ),


  // Player 1: Pawn Row /==================
  // new GameSquareModel( 1, 7, 2, new PieceModel( 1, GamePieceType.Pawn, "9", "FU")),
  // new GameSquareModel( 2, 7, 2, new PieceModel( 1, GamePieceType.Pawn, "8", "FU")),
  // new GameSquareModel( 3, 7, 2, new PieceModel( 1, GamePieceType.Pawn, "7", "FU")),
  // new GameSquareModel( 4, 7, 2, new PieceModel( 1, GamePieceType.Pawn, "6", "FU")),
  // new GameSquareModel( 5, 7, 2, new PieceModel( 1, GamePieceType.Pawn, "5", "FU")),
  // new GameSquareModel( 6, 7, 2, new PieceModel( 1, GamePieceType.Pawn, "4", "FU")),
  // new GameSquareModel( 7, 7, 2, new PieceModel( 1, GamePieceType.Pawn, "3", "FU")),
  // new GameSquareModel( 8, 7, 2, new PieceModel( 1, GamePieceType.Pawn, "2", "FU")),
  // new GameSquareModel( 9, 7, 2, new PieceModel( 1, GamePieceType.Pawn, "1", "FU")),
  new GameSquareModel( 1, 7, 2 ),
  new GameSquareModel( 2, 7, 2 ),
  new GameSquareModel( 3, 7, 2 ),
  new GameSquareModel( 4, 7, 2 ),
  new GameSquareModel( 5, 7, 2 ),
  new GameSquareModel( 6, 7, 2, new PieceModel( 1, PieceType.Pawn, "4", "FU")),
  new GameSquareModel( 7, 7, 2 ),
  new GameSquareModel( 8, 7, 2 ),
  new GameSquareModel( 9, 7, 2 ),

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
  // new SquareModel( 1, 3, 1, new PieceModel( 2, PieceType.Pawn, "9", "FU")),
  // new SquareModel( 2, 3, 1, new PieceModel( 2, PieceType.Pawn, "8", "FU")),
  // new SquareModel( 3, 3, 1, new PieceModel( 2, PieceType.Pawn, "7", "FU")),
  // new SquareModel( 4, 3, 1, new PieceModel( 2, PieceType.Pawn, "6", "FU")),
  // new SquareModel( 5, 3, 1, new PieceModel( 2, PieceType.Pawn, "5", "FU")),
  // new SquareModel( 6, 3, 1, new PieceModel( 2, PieceType.Pawn, "4", "FU")),
  // new SquareModel( 7, 3, 1, new PieceModel( 2, PieceType.Pawn, "3", "FU")),
  // new SquareModel( 8, 3, 1, new PieceModel( 2, PieceType.Pawn, "2", "FU")),
  // new SquareModel( 9, 3, 1, new PieceModel( 2, PieceType.Pawn, "1", "FU")),
  new GameSquareModel( 1, 3, 1 ),
  new GameSquareModel( 2, 3, 1 ),
  new GameSquareModel( 3, 3, 1 ),
  new GameSquareModel( 4, 3, 1 ),
  new GameSquareModel( 5, 3, 1 ),
  new GameSquareModel( 6, 3, 1 ),
  new GameSquareModel( 7, 3, 1 ),
  new GameSquareModel( 8, 3, 1 ),
  new GameSquareModel( 9, 3, 1 ),
  
  // Player 2: Mid Row /==================
  //   new GameSquareModel( 1, 2, 1, new PieceModel( )),
  //   new GameSquareModel( 2, 2, 1, new PieceModel( 2, GamePieceType.Rook, "Right", "HI")),
  //   new GameSquareModel( 3, 2, 1, new PieceModel( )),
  //   new GameSquareModel( 4, 2, 1, new PieceModel( )),
  //   new GameSquareModel( 5, 2, 1, new PieceModel( )),
  //   new GameSquareModel( 6, 2, 1, new PieceModel( )),
  //   new GameSquareModel( 7, 2, 1, new PieceModel( )),
  //   new GameSquareModel( 8, 2, 1, new PieceModel( 2, GamePieceType.Bishop, "Left", "KA")),
  //   new GameSquareModel( 9, 2, 1, new PieceModel( )),

  // // Player 2: Back Row /==================
  //   new SquareModel( 1, 1, 1, new PieceModel( 2, PieceType.Lance,  "Right", "KY")),
    new GameSquareModel( 2, 1, 1, new PieceModel( 2, PieceType.Knight, "Right", "KE")),
  //   new SquareModel( 3, 1, 1, new PieceModel( 2, PieceType.Silver, "Right", "GI")),
  //   new SquareModel( 4, 1, 1, new PieceModel( 2, PieceType.Gold,   "Right", "KI")),

    // new SquareModel( 5, 1, 1, new PieceModel( 2, PieceType.KingChallenger, "Center", "GY")),

  //   new SquareModel( 6, 1, 1, new PieceModel( 2, PieceType.Gold,   "Left", "KI")),
  //   new SquareModel( 7, 1, 1, new PieceModel( 2, PieceType.Silver, "Left", "GI")),
  //   new SquareModel( 8, 1, 1, new PieceModel( 2, PieceType.Knight, "Left", "KE")),
  //   new SquareModel( 9, 1, 1, new PieceModel( 2, PieceType.Lance,  "Left", "KY")),

  // Player 2: Pawn Row (empty) /==================
  // new SquareModel( 1, 3, 1 ),
  // new SquareModel( 2, 3, 1 ),
  // new SquareModel( 3, 3, 1 ),
  // new SquareModel( 4, 3, 1 ),
  // new SquareModel( 5, 3, 1 ),
  // new SquareModel( 6, 3, 1 ),
  // new SquareModel( 7, 3, 1 ),
  // new SquareModel( 8, 3, 1 ),
  // new SquareModel( 9, 3, 1 ),
  
  // Player 2: Mid Row (empty) /==================
    new GameSquareModel( 1, 2, 1, new PieceModel( )),

    // new SquareModel( 2, 2, 1, new PieceModel( 2, PieceType.Rook, "Right", "HI")),
    new GameSquareModel( 2, 2, 1, new PieceModel( )),

    new GameSquareModel( 3, 2, 1, new PieceModel( )),
    new GameSquareModel( 4, 2, 1, new PieceModel( )),

    new GameSquareModel( 5, 2, 1, new PieceModel( )),
    
    // new SquareModel( 6, 2, 1, new PieceModel( )),
    new GameSquareModel( 6, 2, 1, new PieceModel( 2, PieceType.King, "Center", "GY")),

    new GameSquareModel( 7, 2, 1, new PieceModel( )),

    // new SquareModel( 8, 2, 1, new PieceModel( 2, PieceType.Bishop, "Left", "KA")),
    new GameSquareModel( 8, 2, 1, new PieceModel( )),

    new GameSquareModel( 9, 2, 1, new PieceModel( )),

  // Player 2: Back Row (empty) /==================
    new GameSquareModel( 1, 1, 1 ),
    // new SquareModel( 2, 1, 1 ),
    new GameSquareModel( 3, 1, 1 ),
    new GameSquareModel( 4, 1, 1 ),
    new GameSquareModel( 5, 1, 1 ),
    new GameSquareModel( 6, 1, 1 ),
    new GameSquareModel( 7, 1, 1 ),
    new GameSquareModel( 8, 1, 1 ),
    new GameSquareModel( 9, 1, 1 ),
  
  ] // ...Squares
};