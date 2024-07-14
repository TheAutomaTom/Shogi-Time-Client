import { BoardModel } from "@/State/Game/BoardModel";
import { GamePhase } from "./Game/GamePhase";
import { MobilityEngine } from "./Game/Movement/MobilityEngine";
import { PieceModel } from "./Game/Pieces/PieceModel";
import { PieceType } from "./Game/Pieces/PieceType";
import { SquareModel } from "@/State/Game/SquareModel";
import { TargetStatus } from "./Game/Movement/TargetStatus";
import { TestBoardSetup } from "./Game/BoardSetups/TestBoardSetup";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useGameState = defineStore("GameState", () => {
  
  const logPieceSelect = false;
  const logGamePhase = false;

  const Phase = ref(GamePhase.LoadingBoard);
  const Board = ref( 
    new BoardModel( "Test-123", 
                    1,
                    // new NewBoardSetup().Squares,
                    new TestBoardSetup().Squares,
                    [],
                    []
                  ));

  const PieceInHand = ref({} as PieceModel);
  const Origin = ref({} as SquareModel);
  const Destination = ref({} as SquareModel);

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
    const _ = _engine.rebuildSquares( Board.value );
    
  };
  
  // CurrentPlayer selects one of their own piece on the board.
  const MoveStart = (piece: PieceModel) => {
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
    
    Origin.value = Board.value.Squares.find( s =>  s.Piece.Id == PieceInHand.value.Id )
                        || new SquareModel(0, 0);
        
    if(logPieceSelect) logPieceDetails(`\r\n${GamePhase.MoveStart} PieceInHand`, PieceInHand.value);

  };
  
  
  const MoveAttempt =  (square: SquareModel)=>{

    // Check if target is in the current selection's movement rules.
    const target = PieceInHand.value.MovementMap.find(s => s.X === square.X && s.Y === square.Y);    
    if (!target) return;   
   


    // If so, find out how the target relates to the origin.
    switch (target.Status) {



      case TargetStatus.Blocked ||TargetStatus.Ally || TargetStatus.Pinned || TargetStatus.Check || TargetStatus.OutOfRange || TargetStatus.Na:
        // Do nothing
        return;
        


      case TargetStatus.Open:
        // Create the moved piece in that spot.
        square.Piece = new PieceModel( Board.value.CurrentPlayer, PieceInHand.value!.Type, PieceInHand.value!.StartingPosition, PieceInHand.value!.Icon );
        
        // Remove the piece from the origin.
        Origin.value.Piece = new PieceModel();
        // Clear the MovementMap causes squares to highlight.
        PieceInHand.value = new PieceModel(PieceInHand.value.Player, PieceInHand.value.Type, PieceInHand.value.StartingPosition, PieceInHand.value.Icon, PieceInHand.value.IsFacingDefault);

        MoveEnd(square);
        return;
        


      case TargetStatus.Enemy: // Kit it! 

        if( square.Piece.Type == PieceType.KingChallenger || square.Piece.Type == PieceType.KingVictor ){
          return gameOver(Board.value.CurrentPlayer);
        }

        // let capturedPiece = new PieceModel( Board.value.CurrentPlayer, square.Piece.Type, `${square.Piece.StartingPosition}.${Board.value.CurrentPlayer}`, square.Piece.Icon, true );
        let capturedPiece = new PieceModel( Board.value.CurrentPlayer, square.Piece.Type, square.Piece.StartingPosition, square.Piece.Icon, true, square.Piece.MovementMap);
      
        if(logPieceSelect) logPieceDetails("capturedPiece", capturedPiece);            
        capturedPiece.Demote();
        // if(Board.value.CurrentPlayer == 1){ CapturesP1.value.push(capturedPiece); }
        // if(Board.value.CurrentPlayer == 2){ CapturesP2.value.push(capturedPiece); }
        if(Board.value.CurrentPlayer == 1){ Board.value.CapturesP1.push(capturedPiece); }
        if(Board.value.CurrentPlayer == 2){ Board.value.CapturesP2.push(capturedPiece); }

        // Create the moved piece in that spot.
        square.Piece = new PieceModel( Board.value.CurrentPlayer, PieceInHand.value!.Type, PieceInHand.value!.StartingPosition, PieceInHand.value!.Icon );

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
            ( Board.value.CurrentPlayer == 1 && Destination.value.Y == 1 )
            || ( Board.value.CurrentPlayer == 2 && Destination.value.Y == 9 )
          ) )
      {
        if(logPieceSelect) logPieceDetails(`Mandatory promotion on row ${Destination.value.Y}`, PieceInHand.value);
        return PromotePiece();
      }

      // Second, knights get promoted from back 2 rows.
      if(  PieceInHand.value.Type == PieceType.Knight
        && ( 
          ( Board.value.CurrentPlayer == 1 && Destination.value.Y <= 2 )
          || ( Board.value.CurrentPlayer == 2 && Destination.value.Y >= 8 )
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

  const DropStart =(piece: PieceModel)=>{
    console.log( `DropStart() 1: ${piece.Id}` );
    PieceInHand.value = new PieceModel(
      piece.Player,
      piece.Type,
      piece.StartingPosition,
      piece.Icon,
      piece.IsFacingDefault,
      piece.MovementMap
    );
    
  };
  
  const DropAttempt =  (square: SquareModel) =>{
    
    // Find the square that was clicked...
    Board.value.Squares.map(  s =>{
      // ...and check if it's in the movement rules.
      if(s.Id == square.Id && PieceInHand.value.MovementMap.some(ts => ts.Id == s.Id)){

        Destination.value = new SquareModel(s.X, s.Y, s.PromotionZone);     
        console.log(`DropAttempt Destination: ${Destination.value.X}/${Destination.value.Y}/${Destination.value.PromotionZone}`);
        
        if(logPieceSelect) logPieceDetails("PieceInHand", PieceInHand.value);

        // Create the dropped piece in that spot.
        s.Piece = new PieceModel(
          Board.value.CurrentPlayer, 
          PieceInHand.value.Type, 
          PieceInHand.value.StartingPosition, 
          PieceInHand.value.Icon,
          PieceInHand.value.IsFacingDefault
        );
        if(logPieceSelect) logPieceDetails("s.Piece", s.Piece);

        // Remove the piece from the origin.
        if(Board.value.CurrentPlayer == 1){
          console.log(`Removing drop from CapturesP1.`);
          Board.value.CapturesP1 = Board.value.CapturesP1.filter( p => p.Id != PieceInHand.value.Id);
        } else if (Board.value.CurrentPlayer == 2){
          console.log(`Removing drop from CapturesP2.`);
          Board.value.CapturesP2 = Board.value.CapturesP2.filter( p => p.Id != PieceInHand.value.Id);
          
        }
        CompleteMove();
      }
    });
  }
    
  

  // This may be called by PromotionModal
  const PromotePiece =(toPromote: boolean = true)=> {
    if(logPieceSelect) console.log("PromotePiece() called 1");

    if( toPromote && _promotable.includes(PieceInHand.value.Type)){
      if(logPieceSelect) console.log("PromotePiece() called 2");
      Board.value.Squares.map( s =>{
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
    Board.value = _engine.RebuildBoard( Board.value );
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
    if(Board.value.CurrentPlayer == 1){
      Board.value.CurrentPlayer = 2;
    } else {
      Board.value.CurrentPlayer = 1;
    }
    console.error(`Board.value.CurrentPlayer: ${Board.value.CurrentPlayer}`);
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
    DropStart,
    DropAttempt,
    // PriorPieceInHand,
    // PriorOrigin,
    // PriorTarget

  };
});
