import {  
  GameBoardModel,
  GameSquareModel,
  GamePieceModel,
  GamePieceType
} from "../Models/Game";
import { ref } from "vue";
import { defineStore } from "pinia";
import { DefaultNewGameLayout } from "@/State/Game/DefaultNewGameLayout";
import { GameMode } from "./Game/GameMode";
import { Coordinate, MovementRule } from './Game/LegalMoves';

export const useGameState = defineStore("GameState", () => {
  
  const GameBoardModel = ref({  Id:"111-zzz",
                                CurrentPlayer:1,
                                Squares: new DefaultNewGameLayout().Squares
                             } as GameBoardModel);

  const Mode = ref(GameMode.TurnStart);
  const CurrentPlayer = ref(GameBoardModel.value.CurrentPlayer);
  const PieceMoving = ref({} as (GamePieceModel));
  const MoveOrigin = ref({} as GameSquareModel);
  const PotentialDestinations = ref([""] as string[]);
  const Destination = ref({} as GameSquareModel);
  const PieceInHand = ref({} as GamePieceModel);

  const CapturesP1 = ref([
    new GamePieceModel( 2, GamePieceType.Lance, "Left", "1KY")
  ] as GamePieceModel[]);
  const CapturesP2 = ref([

  ] as GamePieceModel[]);

  const _promotable = [
    GamePieceType.Rook,
    GamePieceType.Bishop,
    GamePieceType.Silver,
    GamePieceType.Knight,
    GamePieceType.Lance,
    GamePieceType.Pawn

  ];
  const _demotable = [
    GamePieceType.None,
    GamePieceType.KingVictor,
    GamePieceType.KingChallenger,
    GamePieceType.RookPro,
    GamePieceType.BishopPro,
    GamePieceType.Gold,
    GamePieceType.SilverPro,
    GamePieceType.KnightPro,
    GamePieceType.LancePro,
    GamePieceType.PawnPro
  ];

  //== Movement: Drop ======================================================
  const DropBegin =(piece: GamePieceModel)=> {
    
    Mode.value = GameMode.DropBegin;
    
    // Bookmark the piece in focus.
    PieceInHand.value = piece;

    // Find the starting square based on the id of the piece it contains.
    if(CurrentPlayer.value == 1){
      GameBoardModel.value.Squares.forEach( capture => {
        if(capture.Piece.Id == piece.Id){
          // MoveOrigin.value = capture;

        }
      });

      // Highlight potential move squares
      PotentialDestinations.value = [""]; // reset prior
      const rangeOfMovement = (new MovementRule(piece.Type)).Mobility;
      const facing = setPieceIsFacing(piece.IsFacingDefault);
      
    }
};

  //== Movement: Start =====================================================
  const MoveBegin = async  (piece: GamePieceModel) => {
    
    Mode.value = GameMode.MoveBegin;
    
    // Bookmark the piece in focus.
    PieceMoving.value = piece;

    // Find the starting square based on the id of the piece it contains.
    GameBoardModel.value.Squares.forEach( square => {
      if(square.Piece.Id == piece.Id){
        MoveOrigin.value = square;
      }
    });

    // Highlight potential move squares
    PotentialDestinations.value = [""]; // reset prior
    const rangeOfMovement = (new MovementRule(piece.Type)).Mobility;
    const facing = setPieceIsFacing(piece.IsFacingDefault);

    // Process North ===============================================
    let hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.N; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X ,
        Y: MoveOrigin.value.Y + i * facing

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }
    
    // Process South ===============================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.S; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X ,
        Y: MoveOrigin.value.Y - i * facing

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }

    // Process East ================================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.E; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X - i * facing ,
        Y: MoveOrigin.value.Y

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }
    
    // Process West ================================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.W; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X + i * facing ,
        Y: MoveOrigin.value.Y

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }

    // Process North-West ==========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.NW; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X + i * facing ,
        Y: MoveOrigin.value.Y + i * facing 

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }

    // Process North-East ==========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.NE; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X - i * facing ,
        Y: MoveOrigin.value.Y + i * facing 

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }

    // Process South-East =========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.SE; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X - i * facing ,
        Y: MoveOrigin.value.Y - i * facing 

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }

    // Process South-West ==========================================
    hitObstacle = 0;
    for (let i = 1; i <= rangeOfMovement.SW; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X + i * facing ,
        Y: MoveOrigin.value.Y - i * facing 

      } as Coordinate;
      hitObstacle = findValidMoves(target);
    }

    // Process Knight ==============================================
    if(rangeOfMovement.K){
      let target = { 
        X: MoveOrigin.value.X + 1 * facing,
        Y: MoveOrigin.value.Y + 2 * facing
      } as Coordinate;

      if(target.X > 0 && target.X < 10 && target.Y > 0 && target.Y < 10){
        GameBoardModel.value.Squares.forEach( s => {
          if(s.X == target.X && s.Y == target.Y)
            PotentialDestinations.value.push(s.Id);
        });
      }

      target = { 
        X: MoveOrigin.value.X + -1 * facing,
        Y: MoveOrigin.value.Y + 2 * facing
      } as Coordinate;

      if(target.X > 0 && target.X < 10 && target.Y > 0 && target.Y < 10){
        GameBoardModel.value.Squares.forEach( s => {
          if(s.X == target.X && s.Y == target.Y)
            PotentialDestinations.value.push(s.Id);
        });
      }      
    }

  };



  //== Movement: Move ======================================================
  const MoveAttempt = async (square: GameSquareModel)=>{

    // Find the square that was clicked...
    GameBoardModel.value.Squares.map( s =>{

      // ...and check if it's in the movement rules.
      if(s.Id == square.Id && PotentialDestinations.value.includes(square.Id)){      

        Destination.value = new GameSquareModel(s.X, s.Y, s.PromotionZone);

        // If a piece exists there, move it to the in-hand box.
        if(s.Piece.Player != 0){

          if(CurrentPlayer.value == 1){
            CapturesP1.value.push(
              new GamePieceModel(
                s.Piece.Player, s.Piece.Type, s.Piece.StartingPos, s.Piece.Icon
              ));      
          }
          if(CurrentPlayer.value == 2){
            CapturesP2.value.push(
              new GamePieceModel(
                s.Piece.Player, s.Piece.Type, s.Piece.StartingPos, s.Piece.Icon
              ));
          }

        }

        // Create the moved piece in that spot.
        s.Piece = new GamePieceModel(
          CurrentPlayer.value, PieceMoving.value!.Type, PieceMoving.value!.StartingPos, PieceMoving.value!.Icon
        );

        // Remove the piece from the origin.
        MoveOrigin.value.Piece = new GamePieceModel();

        // Test for Promotion zone.
        if( s.PromotionZone != PieceMoving.value.Player )
        { 
          return CompleteMove();
        }

        // Test if piece can be promoted.
        if( !_promotable.includes(PieceMoving.value.Type) )
        { 
          return CompleteMove();
        }

        if( s.PromotionZone == PieceMoving.value.Player ){
          
          // Handle mandatory promotions...
          // Pawns and lances on the back row get promoted.
          if( ( PieceMoving.value.Type == GamePieceType.Pawn 
                || PieceMoving.value.Type == GamePieceType.Lance  
              ) && ( 
                ( CurrentPlayer.value == 1 && Destination.value.Y == 1 )
                || ( CurrentPlayer.value == 2 && Destination.value.Y == 9 )
              ) )
          {
            console.log(`Promotion mandatory (${PieceMoving.value.Type})`);
            return PromotePiece();
          }

          // Knights get promoted from back 2 rows.
          if(  PieceMoving.value.Type == GamePieceType.Knight
            && ( 
              ( CurrentPlayer.value == 1 && Destination.value.Y <= 2 )
              || ( CurrentPlayer.value == 2 && Destination.value.Y >= 8 )
            ) )
          {
            console.log(`Promotion mandatory (${PieceMoving.value.Type})`);
            return PromotePiece();
          }
   
          console.log(`Promotable.includes(${PieceMoving.value.Type})`);
          Mode.value = GameMode.PromoteOption;
          // PromotionModal will display to continue.
        
        }
      }
    });

  };

  const PromotePiece =(toProceed: boolean = true)=> {
    if(toProceed){
      GameBoardModel.value.Squares.map( s =>{
        if(s.Id == Destination.value.Id){
          console.log(`Promote() before: ${s.Piece.Type}`);
          s.Piece = PieceMoving.value.Promote();
          console.log(`Promote() after : ${s.Piece.Type}`);
        }
      });
    }
    return CompleteMove();
  };

  // Note: CompleteMove can be called locally or by PromoteModal
  const CompleteMove =()=> {
    console.log("CompleteMove()");
    PieceMoving.value = new GamePieceModel( );
    PotentialDestinations.value = [""];

    if(CurrentPlayer.value == 1){
      CurrentPlayer.value = 2;
    } else {
      CurrentPlayer.value = 1;
    }
    Mode.value = GameMode.TurnStart;
  };

  //== Ancillary ===========================================================
  const findValidMoves = (target: Coordinate):number =>{
    let hit = 0;
    // All coordinate locations are to be between 1 and 9
    if(target.X < 1 && target.X > 9 && target.Y < 1 && target.Y > 9){
      console.warn(`Hit off the map @ ${target.X}:${target.Y}... return 8`);
      return 8;
    }
    // Find the target square
    GameBoardModel.value.Squares.forEach( s => {
      if(s.X == target.X && s.Y == target.Y){
        // Found ally
        if( s.Piece.Player == CurrentPlayer.value ){
          console.warn(`Hit Ally @ ${s.Id} (${target.X}:${target.Y})... return 1`);
          hit++;
        }        
        // Found enemy (only add first found)
        else if( hit == 0 
          && s.Piece.Player > 0 && s.Piece.Player != CurrentPlayer.value ){
            PotentialDestinations.value.push(s.Id);
            console.warn(`Hit Enemy@ ${s.Id} (${target.X}:${target.Y})... return 1`);
            hit++;
        }
        // Found empty space
        else if(s.Piece.Player == 0){
          PotentialDestinations.value.push(s.Id);
        }
      }
    });    
    return hit;
  };

  const setPieceIsFacing = (pieceIsFacingDefault: boolean) =>{

    if(pieceIsFacingDefault){
      return CurrentPlayer.value == 1 ? -1 : 1;
    }
    return CurrentPlayer.value == 1 ? 1 : -1;
  };

  return {
    GameBoardModel,
    CurrentPlayer,
    Mode,    
    PieceMoving,
    PieceInHand,
    MoveOrigin,
    MoveBegin,
    MoveAttempt,
    PotentialDestinations,
    Destination,
    PromotePiece,
    CapturesP1,
    CapturesP2,
    DropBegin

  };
});
