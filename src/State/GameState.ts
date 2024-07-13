import { BoardModel } from "@/State/Game/BoardModel";
import { GamePhase } from "./Game/GamePhase";
import { MobilityEngine } from "./Game/Movement/MobilityEngine";
import { PieceModel } from "./Game/Pieces/PieceModel";
import { PieceType } from "./Game/Pieces/PieceType";
import { SquareModel } from "@/State/Game/SquareModel";
import { TargetStatus } from "./Game/Movement/TargetStatus";
import { TestBoardSetup } from "./Game/BoardSetups/TestBoardSetup";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { TargetSquare } from "./Game/Movement/TargetSquare";

export const useGameState = defineStore("GameState", () => {
  
  const logPieceSelect = true;
  const logGamePhase = false;

  const Phase = ref(GamePhase.LoadingBoard);
  const Board = reactive({  Id:"111-zzz",
                       CurrentPlayer:1,
                      //  Squares: new DefaultNewGameLayout().Squares
                       Squares: new TestBoardSetup().Squares
                    } as BoardModel);

  const PieceInHand = ref({} as PieceModel);
  const Origin = ref({} as SquareModel);
  const Destination = ref({} as SquareModel);

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
    if(logGamePhase)console.log(`GameState.TurnStart()`);
    Phase.value = GamePhase.TurnStart;
    resetSelections();
    _engine.RebuildSquares( Board );
    
  };
  
  // CurrentPlayer selects one of their own piece on the board.
  const MoveStart =   (piece: PieceModel) => {
    resetSelections();
    Phase.value = GamePhase.MoveStart;
    
    if(logPieceSelect) logPieceDetails(`\r\n${GamePhase.MoveStart} piece`, piece);

    PieceInHand.value = new PieceModel(
      piece.Player,
      piece.Type,
      piece.StartingPosition,
      piece.Icon,
      piece.IsFacingDefault,
      piece.MovementMap
    );
    
    Origin.value = Board.Squares.find( s =>  s.Piece.Id == PieceInHand.value.Id )
                        || new SquareModel(0, 0);
        
    if(logPieceSelect) logPieceDetails(`\r\n${GamePhase.MoveStart} PieceInHand`, PieceInHand.value);

  };
  
  
  const MoveAttempt =  (square: SquareModel)=>{

    // Check if target is in the current selection's movement rules.
    const target = PieceInHand.value.MovementMap.find(s => s.X === square.X && s.Y === square.Y);    
    if (!target) return;   
   


    // If so, find out how the target relates to the origin.
    switch (target.Status) {



      case TargetStatus.Ally || TargetStatus.Pinned || TargetStatus.Check || TargetStatus.OutOfRange || TargetStatus.Na:
        // Do nothing
        return;
        


      case TargetStatus.Open:
        // Create the moved piece in that spot.
        square.Piece = new PieceModel( Board.CurrentPlayer, PieceInHand.value!.Type, PieceInHand.value!.StartingPosition, PieceInHand.value!.Icon );
        
        // Remove the piece from the origin.
        Origin.value.Piece = new PieceModel();
        // Clear the MovementMap causes squares to highlight.
        PieceInHand.value = new PieceModel(PieceInHand.value.Player, PieceInHand.value.Type, PieceInHand.value.StartingPosition, PieceInHand.value.Icon, PieceInHand.value.IsFacingDefault);

        MoveEnd(square);
        return;
        


      case TargetStatus.Enemy: // Kit it! 

        if( square.Piece.Type == PieceType.KingChallenger || square.Piece.Type == PieceType.KingVictor ){
          return gameOver(Board.CurrentPlayer);
        }

        let capturedPiece = new PieceModel( Board.CurrentPlayer, square.Piece.Type, `${square.Piece.StartingPosition}.C${Board.CurrentPlayer}`, square.Piece.Icon, true );
      
        if(logPieceSelect) logPieceDetails("capturedPiece", capturedPiece);            
        capturedPiece.Demote();
        if(Board.CurrentPlayer == 1){ CapturesP1.value.push(capturedPiece); }
        if(Board.CurrentPlayer == 2){ CapturesP2.value.push(capturedPiece); }

        // Create the moved piece in that spot.
        square.Piece = new PieceModel( Board.CurrentPlayer, PieceInHand.value!.Type, PieceInHand.value!.StartingPosition, PieceInHand.value!.Icon );

        // Remove the moved piece from its origin.
        Origin.value.Piece = new PieceModel();

        // Clear the MovementMap that causes squares to highlight.
        PieceInHand.value = new PieceModel( PieceInHand.value.Player, PieceInHand.value.Type, PieceInHand.value.StartingPosition, PieceInHand.value.Icon, PieceInHand.value.IsFacingDefault );

        MoveEnd(square);
        break;
    
      default:
        break;
    }
    
  };

  const MoveEnd =(square: SquareModel)=> {
    Destination.value = new SquareModel( square.X, square.Y, square.PromotionZone, square.Piece );
    Phase.value = GamePhase.MoveEnd;
          
    // Test for promotion zone and if piece type can be promoted.
    if( square.PromotionZone != PieceInHand.value.Player || !_promotable.includes(PieceInHand.value.Type) )
    { 
      return CompleteMove();
    }

    if( square.PromotionZone == PieceInHand.value.Player && _promotable.includes(PieceInHand.value.Type) ){
      if(logPieceSelect) logPieceDetails(`Can promote? ${square.PromotionZone == PieceInHand.value.Player && _promotable.includes(PieceInHand.value.Type)}`, PieceInHand.value)
      
      // Handle mandatory promotions...
      // First, pawns and lances on the back row get promoted.
      if( ( PieceInHand.value.Type == PieceType.Pawn 
            || PieceInHand.value.Type == PieceType.Lance  
          ) && ( 
            ( Board.CurrentPlayer == 1 && Destination.value.Y == 1 )
            || ( Board.CurrentPlayer == 2 && Destination.value.Y == 9 )
          ) )
      {
        if(logPieceSelect) logPieceDetails(`Mandatory promotion on row ${Destination.value.Y}`, PieceInHand.value);
        return PromotePiece();
      }

      // Second, knights get promoted from back 2 rows.
      if(  PieceInHand.value.Type == PieceType.Knight
        && ( 
          ( Board.CurrentPlayer == 1 && Destination.value.Y <= 2 )
          || ( Board.CurrentPlayer == 2 && Destination.value.Y >= 8 )
        ) )
      {
        if(logPieceSelect) logPieceDetails(`Mandatory promotion on row ${Destination.value.Y}`, PieceInHand.value);
        return PromotePiece();
      }

      if(logPieceSelect) logPieceDetails(`Possible promotion`, PieceInHand.value);
      // PromotionModal will display, pending input to continue workflow.
      Phase.value = GamePhase.PromoteOption;
    
    }
    
  };

  /*******************************************************************************************
   * 
   * 
   * 
   * 
    // ...and check if it's in the movement rules.
    if(s.Id == square.Id && PieceInHand.value.MovementMap.includes( )){
      
      Destination.value = new SquareModel(s.X, s.Y, s.PromotionZone);

        // If a piece exists at Destination, kill it!
        if(s.Piece.Player != 0){

          if(s.Piece.Type == PieceType.KingChallenger || s.Piece.Type == PieceType.KingVictor){
            return gameOver(Board.CurrentPlayer);
          }
          
          // let capturedPiece = new PieceModel(
          //   Board.CurrentPlayer, s.Piece.Type, `${s.Piece.StartingPosition}.C${Board.CurrentPlayer}`, s.Piece.Icon, true);
          
          //   if(logPieceSelect) logPieceDetails("capturedPiece", capturedPiece);            
          //   capturedPiece.Demote();
          //   if(logPieceSelect) logPieceDetails("capturedPiece.Demote", capturedPiece);

          // if(Board.CurrentPlayer == 1){ CapturesP1.value.push(capturedPiece); }
          // if(Board.CurrentPlayer == 2){ CapturesP2.value.push(capturedPiece); }

        }

        // // Create the moved piece in that spot.
        // s.Piece = new PieceModel( Board.CurrentPlayer, PieceInHand.value!.Type, PieceInHand.value!.StartingPosition, PieceInHand.value!.Icon );

        // // Remove the piece from the origin.
        // Origin.value.Piece = new PieceModel();

        // // Test for promotion zone and if piece type can be promoted.
        // if( s.PromotionZone != PieceInHand.value.Player || !_promotable.includes(PieceInHand.value.Type) )
        // { 
        //   return CompleteMove();
        // }

        // if( s.PromotionZone == PieceInHand.value.Player && _promotable.includes(PieceInHand.value.Type)){
        //   if(logPieceSelect) logPieceDetails(`Can promote? ${s.PromotionZone == PieceInHand.value.Player && _promotable.includes(PieceInHand.value.Type)}`, PieceInHand.value)
          
        //   // Handle mandatory promotions...
        //   // Pawns and lances on the back row get promoted.
        //   if( ( PieceInHand.value.Type == PieceType.Pawn 
        //         || PieceInHand.value.Type == PieceType.Lance  
        //       ) && ( 
        //         ( Board.CurrentPlayer == 1 && Destination.value.Y == 1 )
        //         || ( Board.CurrentPlayer == 2 && Destination.value.Y == 9 )
        //       ) )
        //   {
        //     if(logPieceSelect) logPieceDetails(`Mandatory promotion on row ${Destination.value.Y}`, PieceInHand.value);
        //     return PromotePiece();
        //   }

        //   // Knights get promoted from back 2 rows.
        //   if(  PieceInHand.value.Type == PieceType.Knight
        //     && ( 
        //       ( Board.CurrentPlayer == 1 && Destination.value.Y <= 2 )
        //       || ( Board.CurrentPlayer == 2 && Destination.value.Y >= 8 )
        //     ) )
        //   {
        //     if(logPieceSelect) logPieceDetails(`Mandatory promotion on row ${Destination.value.Y}`, PieceInHand.value);
        //     return PromotePiece();
        //   }
   
        //   if(logPieceSelect) logPieceDetails(`Possible promotion`, PieceInHand.value);
        //   // PromotionModal will display, pending input to continue workflow.
        //   Phase.value = GamePhase.PromoteOption;
        
        }
      }
   * 
   * 
   * 
   * 


  const DropBegin =(piece: PieceModel)=> {    
    if(logPieceSelect) logPieceDetails("DropBegin(piece)", piece);    
    Phase.value = GamePhase.DropStart;
    
    // Bookmark the piece in focus.
    PieceInHand.value = piece;

    // Find the starting square based on the id of the piece it contains.
    // if(Board.CurrentPlayer == 1){
      // GameBoardModel.value.Squares.forEach( capture => {
      //   if(capture.Piece.Id == piece.Id){
      //     // Origin.value = capture;

      //   }
      // });

      // Highlight potential move squares
      PotentialTargets.value = [""]; // reset prior
      
      // const facing = setPieceIsFacing(piece.IsFacingDefault);
      
      Board..Squares.map( s =>{
        // Highlight potential move squares
        if(s.Piece.Player == 0){

          // If not pawn, lance, or night: add whole board
          if( PieceInHand.value.Type != PieceType.Pawn 
              && PieceInHand.value.Type != PieceType.Lance 
              && PieceInHand.value.Type != PieceType.Knight){
              
              PotentialTargets.value.push(s.Id);
            }
            
          // If pawn or lance: add all but back row
          else if( (PieceInHand.value.Type == PieceType.Pawn || PieceInHand.value.Type == PieceType.Lance)
                    && ((Board.CurrentPlayer == 1 &&  s.Y != 1) || (Board.CurrentPlayer == 2 && s.Y != 9))  )
          {
            PotentialTargets.value.push(s.Id);
          }
            
          // If knight: add all but back 2 rows
          else if( (PieceInHand.value.Type == PieceType.Knight)
                    && ((Board.CurrentPlayer == 1 &&  (s.Y > 2)) || (Board.CurrentPlayer == 2 && (s.Y < 8)))  )
          {
            PotentialTargets.value.push(s.Id);
          }
          
        }
      });
  };

  const DropAttempt =  (square: SquareModel) =>{
    
    // Find the square that was clicked...
    Board..Squares.map(  s =>{
      // ...and check if it's in the movement rules.
      if(s.Id == square.Id && PotentialTargets.value.includes(square.Id)){

        Destination.value = new SquareModel(s.X, s.Y, s.PromotionZone);        
        console.log(`Destination: ${Destination.value.X}/${Destination.value.Y}/${Destination.value.PromotionZone}`);
        
        if(logPieceSelect) logPieceDetails("PieceInHand", PieceInHand.value);

        // Create the dropped piece in that spot.
        s.Piece = new PieceModel(
          Board.CurrentPlayer, 
          PieceInHand.value.Type, 
          PieceInHand.value.StartingPosition, 
          PieceInHand.value.Icon,
          PieceInHand.value.IsFacingDefault
        );
        if(logPieceSelect) logPieceDetails("s.Piece", s.Piece);

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



  
  
   * 
   * 
   * 
   */

  // This may be called by PromotionModal
  const PromotePiece =(toPromote: boolean = true)=> {
    if(logPieceSelect) console.log("PromotePiece() called 1");

    if( toPromote && _promotable.includes(PieceInHand.value.Type)){
      if(logPieceSelect) console.log("PromotePiece() called 2");
      Board.Squares.map( s =>{
        // Use Destination to find which piece to promote.
        if(s.Id == Destination.value.Id){
          if(logPieceSelect) logPieceDetails("Before Promote", PieceInHand.value!);
          s.Piece = PieceInHand.value.Promote();
          if(logPieceSelect) logPieceDetails("After Promote", PieceInHand.value);
        }
      });
    }
    return CompleteMove();
  };

  // Note: CompleteMove could be called locally or by PromoteModal
  const CompleteMove =()=> {
    console.warn("CompleteMove() Start");
    resetSelections();
    switchCurrentPlayer();
    _engine.RebuildSquares( Board );
    Phase.value = GamePhase.TurnStart;
    console.warn("CompleteMove() End");
  };

  
  
  const resetSelections = () =>{
    // PriorPieceInHand.value = PieceInHand.value;
    // PriorOrigin.value = Origin.value;
    // PriorTarget.value = Destination.value;
    
    PieceInHand.value = new PieceModel( );
    Origin.value = new SquareModel(0,0);
    // Destination.value = new SquareModel(0,0);

  };

  const switchCurrentPlayer =()=> {
    if(Board.CurrentPlayer == 1){
      Board.CurrentPlayer = 2;
    } else {
      Board.CurrentPlayer = 1;
    }
    console.error(`Board.CurrentPlayer: ${Board.CurrentPlayer}`);
  };
    
  const gameOver = (player: number) =>{
    Phase.value = GamePhase.GameOver;
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
      \tMovementMap: ${input.MovementMap.length}
      `);
      if(input.MovementMap.length > 0) console.dir(input.MovementMap);
  };

  return {
    Board,
    Phase, 
    TurnStart,
    PieceInHand,
    MoveStart,
    Origin,
    MoveAttempt,
    Destination,
    PromotePiece,
    CapturesP1,
    CapturesP2,
    // DropBegin,
    // DropAttempt,
    // PriorPieceInHand,
    // PriorOrigin,
    // PriorTarget

  };
});
