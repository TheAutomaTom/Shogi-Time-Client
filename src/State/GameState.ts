import { GamePieceType } from "@/State/Game/GamePieceType";
import { GamePieceModel } from "@/State/Game/GamePieceModel";
import { GameBoardModel } from "@/State/Game/GameBoardModel";
import { GameSquareModel } from "@/State/Game/GameSquareModel";
import { ref } from "vue";
import { defineStore } from "pinia";
import { DefaultNewGameLayout } from "@/State/Game/NewGameLayouts/DefaultNewGameLayout";
import { GameMode } from "./Game/GameMode";
import { PotentialRange } from "./Game/PotentialRange";
import { Coordinate } from "./Game/Coordinate";

export const useGameState = defineStore("GameState", () => {
  
  const GameBoardModel = ref({  Id:"111-zzz",
                                CurrentPlayer:1,
                                Squares: new DefaultNewGameLayout().Squares,

                             } as GameBoardModel);

  const Mode = ref(GameMode.TurnStart);
  const CurrentPlayer = ref(GameBoardModel.value.CurrentPlayer);
  const PieceMoving = ref({} as (GamePieceModel));
  const MoveOrigin = ref({} as GameSquareModel);
  const PotentialDestinations = ref([""] as string[]);
  const CheckPins = ref([""] as string[]);
  const Destination = ref({} as GameSquareModel);
  const PieceInHand = ref({} as GamePieceModel);

  const CapturesP1 = ref([] as GamePieceModel[]);
  const CapturesP2 = ref([] as GamePieceModel[]);

  const _promotable = [
    GamePieceType.Rook,
    GamePieceType.Bishop,
    GamePieceType.Silver,
    GamePieceType.Knight,
    GamePieceType.Lance,
    GamePieceType.Pawn
  ];
  
  const MoveBegin = async  (piece: GamePieceModel) => {
    PieceInHand.value = new GamePieceModel();
    
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
    PotentialDestinations.value = [""]; // reset prior
    const potentialRange = PieceInHand.value.PotentialRange;
    const facing = setPieceIsFacing(piece.IsFacingDefault);

    evaluateRangeOfMovement(potentialRange, facing);
  
  };
  
  const MoveAttempt = async (square: GameSquareModel)=>{

    // Find the square that was clicked...
    GameBoardModel.value.Squares.map( s =>{

      // ...and check if it's in the movement rules.
      if(s.Id == square.Id && PotentialDestinations.value.includes(square.Id)){      

        Destination.value = new GameSquareModel(s.X, s.Y, s.PromotionZone);

        // If a piece exists at destination, kill it!
        if(s.Piece.Player != 0){

          if(s.Piece.Type == GamePieceType.KingChallenger || s.Piece.Type == GamePieceType.KingVictor){
            return gameOver(CurrentPlayer.value);
          }
          
          let capturedPiece = new GamePieceModel(
            CurrentPlayer.value, s.Piece.Type, `${s.Piece.StartingPos}.C${CurrentPlayer.value}`, s.Piece.Icon, true);
          
            logPieceDetails("capturedPiece", capturedPiece);            
            capturedPiece.Demote();
            logPieceDetails("capturedPiece.Demote", capturedPiece);

          if(CurrentPlayer.value == 1){ CapturesP1.value.push(capturedPiece); }
          if(CurrentPlayer.value == 2){ CapturesP2.value.push(capturedPiece); }

        }

        // Create the moved piece in that spot.
        s.Piece = new GamePieceModel( CurrentPlayer.value, PieceMoving.value!.Type, PieceMoving.value!.StartingPos, PieceMoving.value!.Icon );

        // Remove the piece from the origin.
        MoveOrigin.value.Piece = new GamePieceModel();

        // Test for promotion zone and if piece type can be promoted.
        if( s.PromotionZone != PieceMoving.value.Player || !_promotable.includes(PieceMoving.value.Type) )
        { 
          return CompleteMove();
        }

        if( s.PromotionZone == PieceMoving.value.Player && _promotable.includes(PieceMoving.value.Type)){
          logPieceDetails(`Can promote? ${s.PromotionZone == PieceMoving.value.Player && _promotable.includes(PieceMoving.value.Type)}`, PieceMoving.value)
          
          // Handle mandatory promotions...
          // Pawns and lances on the back row get promoted.
          if( ( PieceMoving.value.Type == GamePieceType.Pawn 
                || PieceMoving.value.Type == GamePieceType.Lance  
              ) && ( 
                ( CurrentPlayer.value == 1 && Destination.value.Y == 1 )
                || ( CurrentPlayer.value == 2 && Destination.value.Y == 9 )
              ) )
          {
            logPieceDetails(`Mandatory promotion on row ${Destination.value.Y}`, PieceMoving.value);
            return PromotePiece();
          }

          // Knights get promoted from back 2 rows.
          if(  PieceMoving.value.Type == GamePieceType.Knight
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

  const DropBegin =(piece: GamePieceModel)=> {    
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
          if( PieceInHand.value.Type != GamePieceType.Pawn 
              && PieceInHand.value.Type != GamePieceType.Lance 
              && PieceInHand.value.Type != GamePieceType.Knight){
              
              PotentialDestinations.value.push(s.Id);
            }
            
          // If pawn or lance: add all but back row
          else if( (PieceInHand.value.Type == GamePieceType.Pawn || PieceInHand.value.Type == GamePieceType.Lance)
                    && ((CurrentPlayer.value == 1 &&  s.Y != 1) || (CurrentPlayer.value == 2 && s.Y != 9))  )
          {
            PotentialDestinations.value.push(s.Id);
          }
            
          // If knight: add all but back 2 rows
          else if( (PieceInHand.value.Type == GamePieceType.Knight)
                    && ((CurrentPlayer.value == 1 &&  (s.Y > 2)) || (CurrentPlayer.value == 2 && (s.Y < 8)))  )
          {
            PotentialDestinations.value.push(s.Id);
          }
          
        }
      });
  };

  const DropAttempt = async (square: GameSquareModel) =>{
    
    // Find the square that was clicked...
    GameBoardModel.value.Squares.map( async s =>{
      // ...and check if it's in the movement rules.
      if(s.Id == square.Id && PotentialDestinations.value.includes(square.Id)){

        Destination.value = new GameSquareModel(s.X, s.Y, s.PromotionZone);        
        console.log(`Destination: ${Destination.value.X}/${Destination.value.Y}/${Destination.value.PromotionZone}`);
        
        logPieceDetails("PieceInHand", PieceInHand.value);

        // Create the dropped piece in that spot.
        s.Piece = new GamePieceModel(
          CurrentPlayer.value, 
          PieceInHand.value.Type, 
          PieceInHand.value.StartingPos, 
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
    PieceMoving.value = new GamePieceModel( );
    PieceInHand.value = new GamePieceModel( );
    PotentialDestinations.value = [""];
    Destination.value = new GameSquareModel(0,0);

    if(CurrentPlayer.value == 1){
      CurrentPlayer.value = 2;
    } else {
      CurrentPlayer.value = 1;
    }
    Mode.value = GameMode.TurnStart;
  };

  
  //== Ancillary ===========================================================

  // 1. Mode.TurnEnd
  //     `buildGameModel()`...
  // 1.  `foreach => setAllPossibleRange()`
  //      - Gets every move every piece could make, if unobstructed.
  //    
  //      - If the enemy hits an ally,
  //        then the next piece hit by that enemy is your king,
  //        then that ally piece is pinned
  //        and can only move along the line of sight between the king and attacker.
  //    
  //      - Track `RestrictedTo` list of pieces' mobility.
  //        If a piece appears twice, condense the range.
  //    
  //      - Track `IsProtected` state so you know if a king can kill a piece.
  //      - Track if any king is the first to be hit in any range.
  //    
  //        Track if opponent's king is hit to set check condition.
  //
  // 1. - foreach => piecePossiblyPinned
  //        
  // 1. - 
  // 1. TurnStart

  const findPins =()=> {
    // TODO...
  };

  const buildGameModel =(): GameBoardModel=>{

    let squares = [] as GameSquareModel[]
    GameBoardModel.value.Squares.forEach(square => {

      squares.push(square);
    });
    const result =  { Id:GameBoardModel.value.Id,
                      CurrentPlayer:CurrentPlayer.value,
                      Squares: squares
                    } as GameBoardModel
    return result; 
  };

  const setPieceIsFacing = (pieceIsFacingDefault: boolean) =>{
    if(pieceIsFacingDefault){
      return CurrentPlayer.value == 1 ? -1 : 1;
    }
    return CurrentPlayer.value == 1 ? 1 : -1;
  };
  
  const evaluateRangeOfMovement = async (potentialRange: PotentialRange, facing: number)=> {
    
    // Process North ===============================================
    let hitObstacle = 0;
    for (let i = 1; i <= potentialRange.N; i++) {
      
      let target = { 
        X: MoveOrigin.value.X ,
        Y: MoveOrigin.value.Y + i * facing  
      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);

    }
    
    // Process South ===============================================
    hitObstacle = 0;
    for (let i = 1; i <= potentialRange.S; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X ,
        Y: MoveOrigin.value.Y - i * facing
      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);
    }

    // Process East ================================================
    hitObstacle = 0;
    for (let i = 1; i <= potentialRange.E; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X - i * facing ,
        Y: MoveOrigin.value.Y
      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);
    }
    
    // Process West ================================================
    hitObstacle = 0;
    for (let i = 1; i <= potentialRange.W; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X + i * facing ,
        Y: MoveOrigin.value.Y

      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);
    }

    // Process North-West ==========================================
    hitObstacle = 0;
    for (let i = 1; i <= potentialRange.NW; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X + i * facing ,
        Y: MoveOrigin.value.Y + i * facing 

      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);
    }

    // Process North-East ==========================================
    hitObstacle = 0;
    for (let i = 1; i <= potentialRange.NE; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X - i * facing ,
        Y: MoveOrigin.value.Y + i * facing 

      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);
    }

    // Process South-East =========================================
    hitObstacle = 0;
    for (let i = 1; i <= potentialRange.SE; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X - i * facing ,
        Y: MoveOrigin.value.Y - i * facing 

      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);
    }

    // Process South-West ==========================================
    hitObstacle = 0;
    for (let i = 1; i <= potentialRange.SW; i++) {
      if(hitObstacle > 0) break;

      let target = { 
        X: MoveOrigin.value.X + i * facing ,
        Y: MoveOrigin.value.Y - i * facing 

      } as Coordinate;
      hitObstacle = validateMoveCoordinate(target);
    }

    // Process Knight ==============================================
    if(potentialRange.K){
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

  const validateMoveCoordinate = (target: Coordinate):number =>{
    let hit = 0;
    // All coordinate locations are to be between 1 and 9
    if(target.X < 1 && target.X > 9 && target.Y < 1 && target.Y > 9){
      // console.warn(`Hit off the map @ ${target.X}:${target.Y}... return 8`);
      return 8;
    }
    // Find the target square
    GameBoardModel.value.Squares.forEach( s => {
      if(s.X == target.X && s.Y == target.Y){

        // Found ally
        if( s.Piece.Player == CurrentPlayer.value ){
          // console.warn(`Hit Ally @ ${s.Id} (${target.X}:${target.Y})... return 1`);
          hit++;
        }

        // Found enemy (only add first found)
        else if( hit == 0 
          && s.Piece.Player > 0 && s.Piece.Player != CurrentPlayer.value ){

            PotentialDestinations.value.push(s.Id);
            // console.warn(`Hit Enemy@ ${s.Id} (${target.X}:${target.Y})... return 1`);
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

  const gameOver = (player: number) =>{
    Mode.value = GameMode.GameOver;
    console.log(`Player ${player} wins.`);
  };

  const logPieceDetails =(name: string, input: GamePieceModel) => {
    console.log(`${name}...\r
      \tPlayer: ${input.Player}\r
      \tId: ${input.Id}\r
      \tStartingPos: ${input.StartingPos}\r
      \tIcon: ${input.Icon}\r
      \tIconPath: ${input.IconPath}\r
      \tType: ${input.Type}\r
      `);
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
    DropBegin,
    DropAttempt

  };
});
