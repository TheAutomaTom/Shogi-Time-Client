import { DefaultNewGameLayout } from "@/State/Game/NewGameLayouts/DefaultNewGameLayout";
import { BoardModel } from "@/State/Game/BoardModel";
import { GameMode } from "./Game/GameMode";
import { PieceModel } from "./Game/Pieces/PieceModel";
import { SquareModel } from "@/State/Game/SquareModel";
import { PieceType } from "./Game/Pieces/PieceType";
import { defineStore } from "pinia";
import { ref } from "vue";
import { MobilityEngine } from "./Game/Movement/MobilityEngine";

export const useGameState = defineStore("GameState", () => {
  
  const Mode = ref(GameMode.TurnStart);
  const GameBoardModel = ref({  Id:"111-zzz",
                                CurrentPlayer:1,
                                Squares: new DefaultNewGameLayout().Squares
                             } as BoardModel);

  const CurrentPlayer = ref(GameBoardModel.value.CurrentPlayer);
  const PieceMoving = ref({} as PieceModel);
  const MoveOrigin = ref({} as SquareModel);
  const PotentialDestinations = ref([""] as string[]);
  const Destination = ref({} as SquareModel);
  const PieceInHand = ref({} as PieceModel);

  const CapturesP1 = ref([] as PieceModel[]);
  const CapturesP2 = ref([] as PieceModel[]);

  const _engine = new MobilityEngine();

  const _promotable = [
    PieceType.Rook,
    PieceType.Bishop,
    PieceType.Silver,
    PieceType.Knight,
    PieceType.Lance,
    PieceType.Pawn
  ];

  const TurnStart = () => {
    _engine.Rebuild( CurrentPlayer.value, GameBoardModel.value );
    
  };
  
  const MoveBegin = async  (piece: PieceModel) => {
    PieceInHand.value = new PieceModel();
    
    logPieceDetails("MoveBegin", piece);
    
    Mode.value = GameMode.MoveStart;
    
    // Bookmark the piece in focus.
    PieceMoving.value = piece;

    // Find the starting square based on the id of the piece it contains.
    GameBoardModel.value.Squares.forEach( square => {
      if(square.Piece.Id == piece.Id){
        MoveOrigin.value = square;
      }
    });

    // Highlight potential move squares
    // PotentialDestinations.value = [""]; // reset prior
    // ! const rangeOfMovement = (new MovementRule(piece.Type)).Range;
    // ! const facing = setPieceIsFacing(piece.IsFacingDefault);
    // ! evaluateRangeOfMovement(rangeOfMovement, facing);
  
  };
  
  const MoveAttempt = async (square: SquareModel)=>{

    // Find the square that was clicked...
    GameBoardModel.value.Squares.map( s =>{

      // ...and check if it's in the movement rules.
      if(s.Id == square.Id && PotentialDestinations.value.includes(square.Id)){      

        Destination.value = new SquareModel(s.X, s.Y, s.PromotionZone);

        // If a piece exists at destination, kill it!
        if(s.Piece.Player != 0){

          if(s.Piece.Type == PieceType.KingChallenger || s.Piece.Type == PieceType.KingVictor){
            return gameOver(CurrentPlayer.value);
          }
          
          let capturedPiece = new PieceModel(
            CurrentPlayer.value, s.Piece.Type, `${s.Piece.StartingPosition}.C${CurrentPlayer.value}`, s.Piece.Icon, true);
          
            logPieceDetails("capturedPiece", capturedPiece);            
            capturedPiece.Demote();
            logPieceDetails("capturedPiece.Demote", capturedPiece);

          if(CurrentPlayer.value == 1){ CapturesP1.value.push(capturedPiece); }
          if(CurrentPlayer.value == 2){ CapturesP2.value.push(capturedPiece); }

        }

        // Create the moved piece in that spot.
        s.Piece = new PieceModel( CurrentPlayer.value, PieceMoving.value!.Type, PieceMoving.value!.StartingPosition, PieceMoving.value!.Icon );

        // Remove the piece from the origin.
        MoveOrigin.value.Piece = new PieceModel();

        // Test for promotion zone and if piece type can be promoted.
        if( s.PromotionZone != PieceMoving.value.Player || !_promotable.includes(PieceMoving.value.Type) )
        { 
          return CompleteMove();
        }

        if( s.PromotionZone == PieceMoving.value.Player && _promotable.includes(PieceMoving.value.Type)){
          logPieceDetails(`Can promote? ${s.PromotionZone == PieceMoving.value.Player && _promotable.includes(PieceMoving.value.Type)}`, PieceMoving.value)
          
          // Handle mandatory promotions...
          // Pawns and lances on the back row get promoted.
          if( ( PieceMoving.value.Type == PieceType.Pawn 
                || PieceMoving.value.Type == PieceType.Lance  
              ) && ( 
                ( CurrentPlayer.value == 1 && Destination.value.Y == 1 )
                || ( CurrentPlayer.value == 2 && Destination.value.Y == 9 )
              ) )
          {
            logPieceDetails(`Mandatory promotion on row ${Destination.value.Y}`, PieceMoving.value);
            return PromotePiece();
          }

          // Knights get promoted from back 2 rows.
          if(  PieceMoving.value.Type == PieceType.Knight
            && ( 
              ( CurrentPlayer.value == 1 && Destination.value.Y <= 2 )
              || ( CurrentPlayer.value == 2 && Destination.value.Y >= 8 )
            ) )
          {
            logPieceDetails(`Mandatory promotion on row ${Destination.value.Y}`, PieceMoving.value);
            return PromotePiece();
          }
   
          logPieceDetails(`Possible promotion`, PieceMoving.value);
          // PromotionModal will display, pending input to continue workflow.
          Mode.value = GameMode.PromoteOption;
        
        }
      }
    });

  };

  // This may be called by PromotionModal
  const PromotePiece =(toProceed: boolean = true)=> {

    if( toProceed && _promotable.includes(PieceMoving.value.Type)){
      GameBoardModel.value.Squares.map( s =>{
        if(s.Id == Destination.value.Id){
          logPieceDetails("Before Promote", PieceMoving.value!);
          s.Piece = PieceMoving.value.Promote();
          logPieceDetails("After Promote", PieceMoving.value);
        }
      });
    }
    return CompleteMove();
  };

  const DropBegin =(piece: PieceModel)=> {    
    logPieceDetails("DropBegin(piece)", piece);    
    Mode.value = GameMode.DropStart;
    
    // Bookmark the piece in focus.
    PieceInHand.value = piece;

    // Find the starting square based on the id of the piece it contains.
    // if(CurrentPlayer.value == 1){
      // GameBoardModel.value.Squares.forEach( capture => {
      //   if(capture.Piece.Id == piece.Id){
      //     // MoveOrigin.value = capture;

      //   }
      // });

      // Highlight potential move squares
      PotentialDestinations.value = [""]; // reset prior
      
      // const facing = setPieceIsFacing(piece.IsFacingDefault);
      
      GameBoardModel.value.Squares.map( s =>{
        // Highlight potential move squares
        if(s.Piece.Player == 0){

          // If not pawn, lance, or night: add whole board
          if( PieceInHand.value.Type != PieceType.Pawn 
              && PieceInHand.value.Type != PieceType.Lance 
              && PieceInHand.value.Type != PieceType.Knight){
              
              PotentialDestinations.value.push(s.Id);
            }
            
          // If pawn or lance: add all but back row
          else if( (PieceInHand.value.Type == PieceType.Pawn || PieceInHand.value.Type == PieceType.Lance)
                    && ((CurrentPlayer.value == 1 &&  s.Y != 1) || (CurrentPlayer.value == 2 && s.Y != 9))  )
          {
            PotentialDestinations.value.push(s.Id);
          }
            
          // If knight: add all but back 2 rows
          else if( (PieceInHand.value.Type == PieceType.Knight)
                    && ((CurrentPlayer.value == 1 &&  (s.Y > 2)) || (CurrentPlayer.value == 2 && (s.Y < 8)))  )
          {
            PotentialDestinations.value.push(s.Id);
          }
          
        }
      });
  };

  const DropAttempt = async (square: SquareModel) =>{
    
    // Find the square that was clicked...
    GameBoardModel.value.Squares.map( async s =>{
      // ...and check if it's in the movement rules.
      if(s.Id == square.Id && PotentialDestinations.value.includes(square.Id)){

        Destination.value = new SquareModel(s.X, s.Y, s.PromotionZone);        
        console.log(`Destination: ${Destination.value.X}/${Destination.value.Y}/${Destination.value.PromotionZone}`);
        
        logPieceDetails("PieceInHand", PieceInHand.value);

        // Create the dropped piece in that spot.
        s.Piece = new PieceModel(
          CurrentPlayer.value, 
          PieceInHand.value.Type, 
          PieceInHand.value.StartingPosition, 
          PieceInHand.value.Icon,
          PieceInHand.value.IsFacingDefault
        );
        logPieceDetails("s.Piece", s.Piece);

        // Remove the piece from the origin.
        if(CurrentPlayer.value == 1){
          console.log(`Removing drop from CapturesP1.`);
          CapturesP1.value = CapturesP1.value.filter( p => p.Id != PieceInHand.value.Id);
        } else if (CurrentPlayer.value == 2){
          console.log(`Removing drop from CapturesP2.`);
          CapturesP2.value = CapturesP2.value.filter( p => p.Id != PieceInHand.value.Id);
          
        }
        CompleteMove();
      }
    });
  }

  // Note: CompleteMove could be called locally or by PromoteModal
  const CompleteMove =()=> {
    console.warn("CompleteMove()");
    PieceMoving.value = new PieceModel( );
    PieceInHand.value = new PieceModel( );
    PotentialDestinations.value = [""];
    Destination.value = new SquareModel(0,0);

    if(CurrentPlayer.value == 1){
      CurrentPlayer.value = 2;
    } else {
      CurrentPlayer.value = 1;
    }
    Mode.value = GameMode.TurnStart;
  };

  
  //== Ancillary ===========================================================
  
  const gameOver = (player: number) =>{
    Mode.value = GameMode.GameOver;
    console.log(`Player ${player} wins.`);
  };

  const logPieceDetails =(name: string, input: PieceModel) => {
    console.log(`${name}...\r
      \tPlayer: ${input.Player}\r
      \tId: ${input.Id}\r
      \tStartingPos: ${input.StartingPosition}\r
      \tIcon: ${input.Icon}\r
      \tIconPath: ${input.IconPath}\r
      \tType: ${input.Type}\r
      `);
  };

  return {
    GameBoardModel,
    TurnStart,
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
    DropBegin,
    DropAttempt

  };
});
