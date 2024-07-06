import { DefaultNewGameLayout } from "@/State/Game/NewGameLayouts/DefaultNewGameLayout";
import { BoardModel } from "@/State/Game/BoardModel";
import { GameMode as GamePhase } from "./Game/GameMode";
import { PieceModel } from "./Game/Pieces/PieceModel";
import { SquareModel } from "@/State/Game/SquareModel";
import { PieceType } from "./Game/Pieces/PieceType";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { MobilityEngine } from "./Game/Movement/MobilityEngine";

export const useGameState = defineStore("GameState", () => {
  
  const Phase = ref(GamePhase.TurnStart);
  const Board = reactive({  Id:"111-zzz",
                       CurrentPlayer:1,
                      //  Squares: new DefaultNewGameLayout().Squares
                       Squares: new TestBoardSetup().Squares
                    } as BoardModel);

  const PieceInHand = ref({} as PieceModel);

  const MoveOrigin = ref({} as SquareModel);
  const Destination = ref({} as SquareModel);

  const CapturesP1 = ref([] as PieceModel[]);
  const CapturesP2 = ref([] as PieceModel[]);

  const _engine = new MobilityEngine();

  // const _promotable = [
  //   PieceType.Rook,
  //   PieceType.Bishop,
  //   PieceType.Silver,
  //   PieceType.Knight,
  //   PieceType.Lance,
  //   PieceType.Pawn
  // ];

  const TurnStart = () => {
    console.log(`GameState.TurnStart()`);
    _engine.Rebuild( Board );
    
  };
  
  const resetSelections = async () =>{
    PieceInHand.value = new PieceModel();

  }

  const MoveStart = async  (piece: PieceModel) => {
    resetSelections();

    Phase.value = GamePhase.MoveStart;

    // Bookmark the piece in focus.
    PieceInHand.value = piece;

    logPieceDetails(`${GamePhase.MoveStart}`, PieceInHand.value);
    
    // Find the starting square based on the id of the piece it contains.
    MoveOrigin.value = Board.Squares.find( s =>  s.Piece.Id == piece.Id )
                        || new SquareModel(0, 0);
    logPieceDetails("MoveOrigin.Piece", MoveOrigin.value.Piece);
    PieceInHand.value = MoveOrigin.value.Piece;

  }
  
  /*******************************************************************************************
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
  
  const MoveAttempt = async (square: SquareModel)=>{

    // Find the square that was clicked...
    Board.Squares.map( s =>{

      // ...and check if it's in the movement rules.
      if(s.Id == square.Id && PotentialDestinations.value.includes(square.Id)){      

        Destination.value = new SquareModel(s.X, s.Y, s.PromotionZone);

        // If a piece exists at destination, kill it!
        if(s.Piece.Player != 0){

          if(s.Piece.Type == PieceType.KingChallenger || s.Piece.Type == PieceType.KingVictor){
            return gameOver(Board.CurrentPlayer);
          }
          
          let capturedPiece = new PieceModel(
            Board.CurrentPlayer, s.Piece.Type, `${s.Piece.StartingPosition}.C${Board.CurrentPlayer}`, s.Piece.Icon, true);
          
            logPieceDetails("capturedPiece", capturedPiece);            
            capturedPiece.Demote();
            logPieceDetails("capturedPiece.Demote", capturedPiece);

          if(Board.CurrentPlayer == 1){ CapturesP1.value.push(capturedPiece); }
          if(Board.CurrentPlayer == 2){ CapturesP2.value.push(capturedPiece); }

        }

        // Create the moved piece in that spot.
        s.Piece = new PieceModel( Board.CurrentPlayer, PieceInHand.value!.Type, PieceInHand.value!.StartingPosition, PieceInHand.value!.Icon );

        // Remove the piece from the origin.
        MoveOrigin.value.Piece = new PieceModel();

        // Test for promotion zone and if piece type can be promoted.
        if( s.PromotionZone != PieceInHand.value.Player || !_promotable.includes(PieceInHand.value.Type) )
        { 
          return CompleteMove();
        }

        if( s.PromotionZone == PieceInHand.value.Player && _promotable.includes(PieceInHand.value.Type)){
          logPieceDetails(`Can promote? ${s.PromotionZone == PieceInHand.value.Player && _promotable.includes(PieceInHand.value.Type)}`, PieceInHand.value)
          
          // Handle mandatory promotions...
          // Pawns and lances on the back row get promoted.
          if( ( PieceInHand.value.Type == PieceType.Pawn 
                || PieceInHand.value.Type == PieceType.Lance  
              ) && ( 
                ( Board.CurrentPlayer == 1 && Destination.value.Y == 1 )
                || ( Board.CurrentPlayer == 2 && Destination.value.Y == 9 )
              ) )
          {
            logPieceDetails(`Mandatory promotion on row ${Destination.value.Y}`, PieceInHand.value);
            return PromotePiece();
          }

          // Knights get promoted from back 2 rows.
          if(  PieceInHand.value.Type == PieceType.Knight
            && ( 
              ( Board.CurrentPlayer == 1 && Destination.value.Y <= 2 )
              || ( Board.CurrentPlayer == 2 && Destination.value.Y >= 8 )
            ) )
          {
            logPieceDetails(`Mandatory promotion on row ${Destination.value.Y}`, PieceInHand.value);
            return PromotePiece();
          }
   
          logPieceDetails(`Possible promotion`, PieceInHand.value);
          // PromotionModal will display, pending input to continue workflow.
          Phase.value = GamePhase.PromoteOption;
        
        }
      }
    });

  };

  // This may be called by PromotionModal
  const PromotePiece =(toProceed: boolean = true)=> {

    if( toProceed && _promotable.includes(PieceInHand.value.Type)){
      Board.Squares.map( s =>{
        if(s.Id == Destination.value.Id){
          logPieceDetails("Before Promote", PieceInHand.value!);
          s.Piece = PieceInHand.value.Promote();
          logPieceDetails("After Promote", PieceInHand.value);
        }
      });
    }
    return CompleteMove();
  };

  const DropBegin =(piece: PieceModel)=> {    
    logPieceDetails("DropBegin(piece)", piece);    
    Phase.value = GamePhase.DropStart;
    
    // Bookmark the piece in focus.
    PieceInHand.value = piece;

    // Find the starting square based on the id of the piece it contains.
    // if(Board.CurrentPlayer == 1){
      // GameBoardModel.value.Squares.forEach( capture => {
      //   if(capture.Piece.Id == piece.Id){
      //     // MoveOrigin.value = capture;

      //   }
      // });

      // Highlight potential move squares
      PotentialDestinations.value = [""]; // reset prior
      
      // const facing = setPieceIsFacing(piece.IsFacingDefault);
      
      Board..Squares.map( s =>{
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
                    && ((Board.CurrentPlayer == 1 &&  s.Y != 1) || (Board.CurrentPlayer == 2 && s.Y != 9))  )
          {
            PotentialDestinations.value.push(s.Id);
          }
            
          // If knight: add all but back 2 rows
          else if( (PieceInHand.value.Type == PieceType.Knight)
                    && ((Board.CurrentPlayer == 1 &&  (s.Y > 2)) || (Board.CurrentPlayer == 2 && (s.Y < 8)))  )
          {
            PotentialDestinations.value.push(s.Id);
          }
          
        }
      });
  };

  const DropAttempt = async (square: SquareModel) =>{
    
    // Find the square that was clicked...
    Board..Squares.map( async s =>{
      // ...and check if it's in the movement rules.
      if(s.Id == square.Id && PotentialDestinations.value.includes(square.Id)){

        Destination.value = new SquareModel(s.X, s.Y, s.PromotionZone);        
        console.log(`Destination: ${Destination.value.X}/${Destination.value.Y}/${Destination.value.PromotionZone}`);
        
        logPieceDetails("PieceInHand", PieceInHand.value);

        // Create the dropped piece in that spot.
        s.Piece = new PieceModel(
          Board.CurrentPlayer, 
          PieceInHand.value.Type, 
          PieceInHand.value.StartingPosition, 
          PieceInHand.value.Icon,
          PieceInHand.value.IsFacingDefault
        );
        logPieceDetails("s.Piece", s.Piece);

        // Remove the piece from the origin.
        if(Board.CurrentPlayer == 1){
          console.log(`Removing drop from CapturesP1.`);
          CapturesP1.value = CapturesP1.value.filter( p => p.Id != PieceInHand.value.Id);
        } else if (Board.CurrentPlayer == 2){
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
    PieceInHand.value = new PieceModel( );
    PieceInHand.value = new PieceModel( );
    // PotentialDestinations.value = [""];
    Destination.value = new SquareModel(0,0);

    if(Board.CurrentPlayer == 1){
      Board.CurrentPlayer = 2;
    } else {
      Board.CurrentPlayer = 1;
    }
    Phase.value = GamePhase.TurnStart;
  };

  
  //== Ancillary ===========================================================
  
  const gameOver = (player: number) =>{
    Phase.value = GamePhase.GameOver;
    console.log(`Player ${player} wins.`);
  };

   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   */


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
    Board,
    Phase, 
    TurnStart,
    PieceInHand,
    MoveStart,
    MoveOrigin,
    // MoveAttempt,
    Destination,
    // PromotePiece,
    CapturesP1,
    CapturesP2,
    // DropBegin,
    // DropAttempt
    logPieceDetails

  };
});
