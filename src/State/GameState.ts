import { NewBoardSetup } from "./Game/BoardSetups/NewBoardSetup";
import { TestBoardSetup } from "./Game/BoardSetups/TestBoardSetup";
import { BoardModel } from "@/State/Game/BoardModel";
import { GamePhase } from "./Game/GamePhase";
import { MobilityEngine } from "./Game/MobilityEngine2";
import { PieceModel } from "./Game/Pieces/PieceModel";
import { PieceType } from "./Game/Pieces/PieceType";
import { TargetStatus } from "./Game/Squares/TargetStatus";
import { TestCheckBoardSetup } from "./Game/BoardSetups/TestCheckBoardSetup";
import { defineStore } from "pinia";
import { ref } from "vue";
import { GameSquareModel } from "./Game/Squares/GameSquareModel";

export const useGameState = defineStore("GameState", () => {
  
  const logPieceSelect = false;
  const logGamePhase = false;
  const logMethodCalled = false;

  const Phase = ref(GamePhase.LoadingBoard);
  const Board = ref( 
    new BoardModel( "Test-123", 
                    1,
                    // new NewBoardSetup().Squares,
                    // new TestBoardSetup().Squares,
                    new TestCheckBoardSetup().Squares,
                    [],
                    [],
                    []
                  ));
  // const Checks = ref( [] as SquareModel[] );

  const PieceInHand = ref({} as PieceModel);
  const Origin = ref({} as GameSquareModel);
  const Destination = ref({} as GameSquareModel);

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
    if(logGamePhase) logPhase("TurnStart begins");
    Phase.value = GamePhase.LoadingBoard;
    resetSelections();

    const update = _engine.RebuildBoard( Board.value );
    Board.value = new BoardModel( 
                          update.Id, 
                          update.CurrentPlayer,
                          update.Squares,
                          update.CapturesP1,
                          update.CapturesP2,
                          update.Checks                                        
                        );
    
    Phase.value = GamePhase.TurnStart;
    
  };
  
  // CurrentPlayer selects one of their own piece on the board.
  const MoveStart = (piece: PieceModel) => {
    resetSelections();
    Phase.value = GamePhase.MoveStart;

    if(logGamePhase) logPhase("MoveStart begins");    
    if(logPieceSelect) logPieceDetails(`\r\n${GamePhase.MoveStart} piece`, piece);

    PieceInHand.value = new PieceModel(
      piece.Player,
      piece.Type,
      piece.StartingPosition,
      piece.Icon,
      piece.Mobility
    );
    
    Origin.value = Board.value.Squares.find( s =>  s.Piece.Id == PieceInHand.value.Id )
                   || new GameSquareModel(0, 0);
        
    if(logPieceSelect) logPieceDetails(`\r\n${GamePhase.MoveStart} PieceInHand`, PieceInHand.value);

  };
  
  
  const MoveAttempt =  (square: GameSquareModel)=>{

    // Check if target is in the current selection's movement rules.
    const target = PieceInHand.value.Mobility.Map.find(s => s.X === square.X && s.Y === square.Y);    
    if (!target) return;


    console.log(`MoveAttempt square.Piece.Type: ${square.Piece.Type}`);
   


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
        PieceInHand.value = new PieceModel(PieceInHand.value.Player, PieceInHand.value.Type, PieceInHand.value.StartingPosition, PieceInHand.value.Icon, PieceInHand.value.Mobility);

        return MoveEnd(square);



      case TargetStatus.Enemy: // Kit it! 

        if( square.Piece.Type == PieceType.King ){
          console.log(`MoveAttempt: ${TargetStatus.Enemy} = ${PieceType.King}... call gameOver()`);
          gameOver(Board.value.CurrentPlayer);
          break;
        }

        // let capturedPiece = new PieceModel( Board.value.CurrentPlayer, square.Piece.Type, `${square.Piece.StartingPosition}.${Board.value.CurrentPlayer}`, square.Piece.Icon, true );
        let capturedPiece = new PieceModel( Board.value.CurrentPlayer, square.Piece.Type, square.Piece.StartingPosition, square.Piece.Icon);
      
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
        PieceInHand.value = new PieceModel( PieceInHand.value.Player, PieceInHand.value.Type, PieceInHand.value.StartingPosition, PieceInHand.value.Icon, PieceInHand.value.Mobility );

        return MoveEnd(square);
    
      default:
        break;


    }    
  };



  const MoveEnd =(square: GameSquareModel)=> {
    
    Destination.value = new GameSquareModel( square.X, square.Y, square.PromotionZoneFor, square.Piece );
    Phase.value = GamePhase.MoveEnd;
    if(logGamePhase) logPhase("MoveEnd begins");
          
    // Test for promotion zone and if piece type can be promoted.
    if( square.PromotionZoneFor != PieceInHand.value.Player || !_promotable.includes(PieceInHand.value.Type) )
    { 
      return CompleteMove();
    }

    if( square.PromotionZoneFor == PieceInHand.value.Player && _promotable.includes(PieceInHand.value.Type) ){
      if(logPieceSelect) logPieceDetails(`Can promote? ${square.PromotionZoneFor == PieceInHand.value.Player && _promotable.includes(PieceInHand.value.Type)}`, PieceInHand.value)
      
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
      if(logGamePhase) logPhase("MoveEnd last return");
      return Phase.value = GamePhase.PromoteOption;
    
    }
    
  };

  const DropStart =(piece: PieceModel)=>{
    console.log( `DropStart() 1: ${piece.Id}` );
    PieceInHand.value = new PieceModel(
      piece.Player,
      piece.Type,
      piece.StartingPosition,
      piece.Icon,
      piece.Mobility,
    );
    
  };
  
  const DropAttempt =  (square: GameSquareModel) =>{
    
    // Find the square that was clicked...
    Board.value.Squares.map(  s =>{
      // ...and check if it's in the movement rules.
      if(s.Id == square.Id && PieceInHand.value.Mobility.Map.some(ts => ts.Id == s.Id)){

        Destination.value = new GameSquareModel(s.X, s.Y, s.PromotionZoneFor);     
        console.log(`DropAttempt Destination: ${Destination.value.X}/${Destination.value.Y}/${Destination.value.PromotionZoneFor}`);
        
        if(logPieceSelect) logPieceDetails("PieceInHand", PieceInHand.value);

        // Create the dropped piece in that spot.
        s.Piece = new PieceModel(
          Board.value.CurrentPlayer, 
          PieceInHand.value.Type, 
          PieceInHand.value.StartingPosition, 
          PieceInHand.value.Icon,
          PieceInHand.value.Mobility
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

    if(logGamePhase) logPhase("PromoteOption start");

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
    if(logGamePhase) logPhase("PromoteOption ends");
    return CompleteMove();
  };

  // Note: CompleteMove could be called locally or by PromoteModal
  const CompleteMove =()=> {
    if(logGamePhase) logPhase("CompleteMove begin");
    resetSelections();
    switchCurrentPlayer();
    Board.value = _engine.RebuildBoard( Board.value );
    
    // This will need to send data to server and await a response.
    Phase.value = GamePhase.TurnStart;
    if(logGamePhase) logPhase("CompleteMove ends");
  };
 
  
  
  const resetSelections = () =>{
    // PriorPieceInHand.value = PieceInHand.value;
    // PriorOrigin.value = Origin.value;
    // PriorTarget.value = Destination.value;
    
    PieceInHand.value = new PieceModel( );
    Origin.value = new GameSquareModel(0,0);
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
    console.log(`${GamePhase.GameOver}: Player ${player} wins.`);
    if(logGamePhase) logPhase("gameOver ends");
    return Phase.value = GamePhase.GameOver;
    
  };

  const logPhase = (caller: string = "") =>{
    console.log(`\r\n\r\nGame Phase: ${Phase.value} (${caller})`);
  };
  
  const logMethod = (method: string, step: string = "") =>{
    const s = step != "" ? `: ${step}` : '';
    console.log(`${method}${s}`);
  };

  const logPieceDetails =(name: string, input: PieceModel) => {
    console.log(`${name}...\r
      \tPlayer: ${input.Player}\r
      \tId: ${input.Id}\r
      \tStartingPos: ${input.StartingPosition}\r
      \tIcon: ${input.Icon}\r
      \tIconPath: ${input.IconPath}\r
      \tType: ${input.Type}\r
      \tMovementMap: ${input.Mobility.Map.length}
      `);
      if(input.Mobility.Map.length > 0) console.dir(input.Mobility.Map);
  };  

  return {
    Board,
    // Checks,
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
