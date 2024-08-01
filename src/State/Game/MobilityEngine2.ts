import { BaseSquareModel } from "./Squares/BaseSquareModel";
import { BoardModel } from "./BoardModel";
import { GameSquareModel } from "./Squares/GameSquareModel";
import { Mobility } from "./Movement/Mobility";
import { PieceType } from "./Pieces/PieceType";
import { TargetSquareModel } from "./Squares/TargetSquareModel";
import { TargetStatus } from "./Squares/TargetStatus";
import { Vector } from "./Movement/Vector";
import { VectorName } from "./Movement/VectorName";
import { VectorTargetReport } from "./Movement/VectorTargetReport";

export class MobilityEngine {
  logSubject = {enabled: false, id: "P1-Bishop-Left"};
  logPhase = true;

  RebuildBoard = ( input: BoardModel ): BoardModel =>{

    if(this.logPhase) console.log("\r\n RebuildBoard ... ");
    let result = this.rebuildSquares(input);
    // result = this.rebuildDrops(result);
    
    //...

    return result;
  };


/*
  rebuildDrops  = ( board: BoardModel ): BoardModel =>{
    if(this.logPhase) console.log(`\r\n rebuildDrops... `);
    
    // Make a list of columns that pawns can be placed on for each player.
    let openFilesP1 = this.findOpenFiles(1, board);
    let openFilesP2 = this.findOpenFiles(2, board);
        
    // Loop through captured pieces (player 1)
    board.CapturesP1.forEach(capture => {
      capture.Mobility.Map = [];
      board.Squares.forEach(s => {

        if(s.Piece.Player == 0){
          
          // If not pawn, lance, or night: add whole board
          if( capture.Type != PieceType.Pawn && capture.Type != PieceType.Lance && capture.Type != PieceType.Knight ){
            capture.Mobility.Map.push(new TargetSquareModel(s.X, s.Y, TargetStatus.Open));
          }
        
          // If lance: add all but last back row
          else if( capture.Type == PieceType.Lance && ((capture.Player == 1 &&  s.Y != 1) || (capture.Player == 2 && s.Y != 9)) ){
            capture.Mobility.Map.push(new TargetSquareModel(s.X, s.Y, TargetStatus.Open));
          }
        
          // If pawn: add all but last back row and other columns with existing pawns
          else if( capture.Type == PieceType.Pawn && ((capture.Player == 1 &&  s.Y != 1) || (capture.Player == 2 && s.Y != 9)) ){
            
            console.log(`\topenFilesP1...1`);
            if(capture.Player == 1 && openFilesP1.includes(s.X)){
              console.warn(`\r\n rebuildDrops: ${PieceType.Pawn}, Player ${capture.Player}, s.X ${s.X}, s.Y ${s.Y}`);
              console.log(`\topenFilesP1...2`);
              console.dir(openFilesP1);
              capture.Mobility.Map.push(new TargetSquareModel(s.X, s.Y, TargetStatus.Open));
            }

            if(capture.Player == 2 && openFilesP2.includes(s.X)){
              capture.Mobility.Map.push(new TargetSquareModel(s.X, s.Y, TargetStatus.Open));
            }

          }

          // If knight: add all but back 2 rows
          else if( (capture.Type == PieceType.Knight)
            && ((board.CurrentPlayer == 1 &&  (s.Y > 2)) || (board.CurrentPlayer == 2 && (s.Y < 8)))  )
          {
            capture.Mobility.Map.push(new TargetSquareModel(s.X, s.Y, TargetStatus.Open));
          }
        
        }
      });

    });
    
    // Loop through captured pieces (player 2)
    board.CapturesP2.forEach(capture => {
      capture.Mobility.Map = [];
      board.Squares.forEach(s => {

        if(s.Piece.Player == 0){
          
          // If not pawn, lance, or night: add whole board
          if( capture.Type != PieceType.Pawn && capture.Type != PieceType.Lance && capture.Type != PieceType.Knight ){
            capture.Mobility.Map.push(new TargetSquareModel(s.X, s.Y, TargetStatus.Open));
          }
        
          // If lance: add all but last back row
          else if( capture.Type == PieceType.Lance && ((capture.Player == 1 &&  s.Y != 1) || (capture.Player == 2 && s.Y != 9)) ){
            capture.Mobility.Map.push(new TargetSquareModel(s.X, s.Y, TargetStatus.Open));
          }
        
          // If pawn: add all but last back row and other columns with existing pawns
          else if( capture.Type == PieceType.Pawn && ((capture.Player == 1 &&  s.Y != 1) || (capture.Player == 2 && s.Y != 9)) ){
            
            console.log(`\topenFilesP1...1`);
            if(capture.Player == 1 && openFilesP1.includes(s.X)){
              console.warn(`\r\n rebuildDrops: ${PieceType.Pawn}, Player ${capture.Player}, s.X ${s.X}, s.Y ${s.Y}`);
              console.log(`\topenFilesP1...2`);
              console.dir(openFilesP1);
              capture.Mobility.Map.push(new TargetSquareModel(s.X, s.Y, TargetStatus.Open));
            }

            if(capture.Player == 2 && openFilesP2.includes(s.X)){
              capture.Mobility.Map.push(new TargetSquareModel(s.X, s.Y, TargetStatus.Open));
            }

          }

          // If knight: add all but back 2 rows
          else if( (capture.Type == PieceType.Knight)
            && ((board.CurrentPlayer == 1 &&  (s.Y > 2)) || (board.CurrentPlayer == 2 && (s.Y < 8)))  )
          {
            capture.Mobility.Map.push(new TargetSquareModel(s.X, s.Y, TargetStatus.Open));
          }
        
        }
      });

    });

    return board;

  };
*/
  
  rebuildSquares = ( board: BoardModel ): BoardModel => {
    
    // First iteration finds all moves without consideration of how checks or pins affect individual movement.
    if(this.logPhase) console.log("\r\n rebuildSquares first iteration... ");
    
    board.Squares.forEach( square => {
      if(square.Piece?.Player != 0){ // Empty squares actually have blank pieces assigned to Player 0.

        const logSubject = this.logSubject.enabled && square.Piece.Id == this.logSubject.id;
        if(logSubject) console.warn(`MobilityEngine.RebuildSquares()\r\n logSubject: ${this.logSubject.id}`); 

        square.Piece.Mobility = this.rebuildMobility(board, square);
      }      
    });
    
    // Second iteration finds attackers' checks and pins, and constrains movement on targets.  A flat map is created for each piece for Views to bind on.
    if(this.logPhase) console.log("\r\n rebuildSquares second iteration... ");
    board.Squares.forEach( square => {
      if(square.Piece?.Player != 0){ // Empty squares actually have blank pieces assigned to Player 0.

        const logSubject = this.logSubject.enabled && square.Piece.Id == this.logSubject.id;
        if(logSubject) console.warn(`MobilityEngine.RebuildSquares()\r\n \t logSubject: ${this.logSubject.id}`); 
        
        const pinning = square.Piece.Mobility.Vectors.filter(v => v.PinnedPiece != null);
        if(pinning.length == 0){
          
          if(logSubject) console.log(`\t pinning.length = ${pinning.length}`); 
          square.Piece.Mobility.Vectors.forEach(vector => {
            // vector.Targets.forEach( t => square.Piece.Mobility.Map.push(new BaseSquareModel(t.X, t.Y)) );
            if(logSubject) {
              console.log(`\t vector.Targets...`);
              console.dir(vector.Targets);
            }
            vector.Targets.forEach( t => square.Piece.Mobility.Map.push(t) );
          });
          if(logSubject) {
            console.log(`\t Piece.Mobility.Map...`);
            console.dir(square.Piece.Mobility.Map);
          }

        } else {
          if(logSubject) console.log(`\t pinning.length = ${pinning.length}`); 
          pinning.forEach(attackVector => { 
            board.Squares.forEach(s => {

              if(attackVector.PinnedPiece!.Id == s.Piece.Id){
                const vectorPinnedToName = this.complimentaryVectorName(attackVector.Name);
                const vectorPinnedTo = s.Piece.Mobility.Vectors.find(v => v.Name == vectorPinnedToName);
                
                // This this piece can't move in the attack vector, then it can't move anywhere (like a pawn pinned in the X axis)
                if(vectorPinnedTo == undefined){
                  s.Piece.Mobility.Map = [];
                } else{
                  square.Piece.Mobility = this.rebuildMobility(board, square, vectorPinnedTo);
                  square.Piece.Mobility.Vectors.forEach( v => {
                    const validMoves = v.Targets.filter(t => t.Status == TargetStatus.Open || t.Status == TargetStatus.Enemy || t.Status == TargetStatus.Check);
                    s.Piece.Mobility.Map = [...validMoves];
                  });
                }

              }
            });
          });
        }


      }
    });

    if(this.logSubject.enabled){
      const subject = board.Squares.filter(s => s.Piece.Id == this.logSubject.id);
      console.log("subject[0].Piece.Mobility.Map...");
      console.dir(subject[0].Piece.Mobility.Map);
      
    }

    return board;
  };

  flattenVectors = (vectors: Vector[]): BaseSquareModel[] =>{
    const map = [] as BaseSquareModel[];
    vectors.forEach(vector => {
      vector.Targets.forEach( t => 
        map.push(new BaseSquareModel(t.X, t.Y))
      )
    });
    return map;
  };
  
  rebuildMobility = ( board: BoardModel, square: GameSquareModel, pinnedTo: Vector = new Vector(VectorName.None) ): Mobility => {
    
    const isLogSubject = this.logSubject.enabled && square.Piece.Id == this.logSubject.id;
        
    if(this.logPhase && isLogSubject) {
      console.warn("\t rebuildMobility 1... ");
      console.dir(square.Piece.Mobility);
      console.dir(square.Piece.Mobility.Vectors);
      // square.Piece.Mobility.Vectors.forEach(v => { console.log(`\t ${v.Name}`); });
      console.log(`\t pinnedTo.Name == ${pinnedTo.Name}`);
    }

    const facing = this.setPieceIsFacing(square.Piece.Player, square.Piece.Mobility.IsFacingDefault);
     


    if(pinnedTo.Name == VectorName.None){ // Typical workflow.
            
      //==========================================================================================================
      if(this.logPhase && isLogSubject) {
        console.log("\tvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
      }
      let newVectors = [] as Vector[];
      square.Piece.Mobility.Vectors.forEach(vector => {
        const v = this.rebuildVector(vector, board, square, facing, isLogSubject);
        newVectors.push(v);
        
      });
      if(this.logPhase && isLogSubject) {
        console.log("\t^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");         
      }
      //==========================================================================================================

        
      if(this.logPhase && isLogSubject) {
        console.log("\tsquare.Piece.Mobility 2 (newVectors): "); 
        console.dir(newVectors); 
        square.Piece.Mobility.Vectors = newVectors;
        console.log("\tsquare.Piece.Mobility 2b: "); 
        console.dir(square.Piece.Mobility.Vectors);
      }

    } else {  // This piece is pinned, so constrain its movement to that vector.
      square.Piece.Mobility.Vectors.forEach(vector => {        

        if(this.logPhase && isLogSubject) { console.warn(`\t\tRebuild vector # ${square.Piece.Mobility.Vectors.length}: ${vector.Name}`); }
        vector = this.rebuildVector(pinnedTo, board, square, facing, isLogSubject );
      });

    }

    if(this.logPhase && isLogSubject) {
      console.log("\tsquare.Piece.Mobility 3: "); 
      console.dir(square.Piece.Mobility);
      console.log("\tsquare.Piece.Mobility 3b: "); 
      console.dir(square.Piece.Mobility.Vectors);
    }
  
    return square.Piece.Mobility;
  };
  
  rebuildVector = ( vector: Vector, board: BoardModel, square: GameSquareModel, facing: number , isLogSubject: boolean): Vector => {
    if(isLogSubject) {
      console.warn("\t\trebuildVector 1: " + vector.Name + " w/ range " + + vector.Range); 
      console.dir(vector);
    }

    // Knights only...
    if(vector.Name == VectorName.K){
      let targetX = square.X + 1 * facing;
      let targetY = square.Y + 2 * facing;
      if( targetX > 0 && targetX < 10 && targetY > 0 && targetY < 10 ){
        const target = this.evaluateVectorTarget( board, square.Piece.Player, this.squareId(targetX, targetY), false, isLogSubject );
        vector = vector.Update( target.Status, target.Square!, isLogSubject );
        
      }
      targetX = square.X + -1 * facing;
      targetY = square.Y + 2 * facing;
      if( targetX > 0 && targetX < 10 && targetY > 0 && targetY < 10 ){
        const target = this.evaluateVectorTarget( board, square.Piece.Player, this.squareId(targetX, targetY), false, isLogSubject );
        vector = vector.Update( target.Status, target.Square!, isLogSubject );
        
      }
      return vector;

    // Anything except Knights...
    } else { 
      let isBlocked = false;
      
      // Iterate each coordinate along one vector (ex: north)...
      for (let i = 1; i <= vector.Range; i++) {
      
        const targetX = vector.XIncrement == 0 ? square.X 
                                               : square.X + i * vector.XIncrement * facing;
        const targetY = vector.YIncrement == 0 ? square.Y 
                                               : square.Y + i * vector.YIncrement * facing;
        
        if( targetX > 0 && targetX < 10 && targetY > 0 && targetY < 10 ){
          
          const target = this.evaluateVectorTarget( board, square.Piece.Player, this.squareId(targetX, targetY), isBlocked, isLogSubject );
          
          isBlocked = this.isBlocked(target.Status);
          if(this.squareId(targetX, targetY) == "S18"){
            console.log(`${square.Piece.Id} isBlocked on ${vector.Name} at ${this.squareId(targetX, targetY)}.`);
          }

          vector = vector.Update( target.Status, target.Square! );
          if(isLogSubject) {console.warn("\t\trebuildVector 2 (update result): "); console.dir(vector);}
          
        }
      }
      return vector;
    }

  };

  isBlocked = (status: TargetStatus): boolean =>{
    if(status == TargetStatus.Blocked || status == TargetStatus.Ally || status == TargetStatus.Enemy || status == TargetStatus.Check){
      return true;
    }
    return false;
  };

  evaluateVectorTarget = (
    board: BoardModel, playersTurn: number, targetId: string, isBlocked: boolean, isLogSubject: boolean
  ): VectorTargetReport => {

    if(isLogSubject) console.warn("\t\t\t\t evaluateVectorTarget 1: " + targetId); 
     const toLog = targetId == "S28";

    // Find the target square.
    const s = board.Squares.find( s => s.Id == targetId);
    if(s == undefined) {
      return {
        Square: new GameSquareModel(0, 0),
        Status: TargetStatus.OutOfRange
      } as VectorTargetReport;
    }
    
    let status: TargetStatus;
    switch (s?.Piece.Player) {
      
      case 0: // Open squares
        if(isLogSubject || toLog) {
          console.log("\t\t\t\t evaluateVectorTarget 2: Player #" + s?.Piece.Player + "'s Open Square"); 
          console.log(`\t\t\t\t ${targetId}: ${TargetStatus.Open}`);
        }
        status = isBlocked ? TargetStatus.Blocked : TargetStatus.Open;
        break;

      case playersTurn:
        if(isLogSubject || toLog) {
          console.log("\t\t\t\t evaluateVectorTarget 2: Player #" + s?.Piece.Player + "'s Ally"); 
          console.log(`\t\t\t\t ${targetId}/ ${TargetStatus.Enemy}/ ${s.Piece.Id}.  Input playersTurn: ${playersTurn}.`); 
        }
        status = TargetStatus.Ally;
        break;
    
      default: // Enemy      
          console.log("\t\t\t\t evaluateVectorTarget 2: Player #" + s?.Piece.Player + "'s Enemy"); 
        // const isCheck = s.Piece.Type == PieceType.KingChallenger || PieceType.KingVictor;
        const isCheck = s.Piece.Type == PieceType.King;
        if( isCheck ){
          if(isLogSubject || toLog){ console.log(`\t\t\t\t ${targetId}/ ${TargetStatus.Enemy}/ ${s.Piece.Id}.  Input playersTurn: ${playersTurn}, isBlocked: ${isBlocked}, isCheck: ${isCheck}.`); }

          status = isBlocked ? TargetStatus.BlockedCheck : TargetStatus.Check;
          break;

        } else {
          if(isLogSubject || toLog){ console.log(`\t\t\t\t ${targetId}/ ${TargetStatus.Enemy}/ ${s.Piece.Id}.  Input playersTurn: ${playersTurn}, isBlocked: ${isBlocked},isCheck: ${isCheck}.`); }
          
          status = isBlocked ? TargetStatus.Blocked : TargetStatus.Enemy;
          break;
        }
    };

    return {
      Square: s,
      Status: status
    } as VectorTargetReport;

  };
  


  setPieceIsFacing = (player: number, isDefault: boolean): number =>{
    if(isDefault){
      return player == 1 ? -1 : 1;
    }
    return player == 1 ? 1 : -1;
  };

  squareId = (x: number, y: number): string => `S${x}${y}`;
  
  complimentaryVectorName = (input: VectorName): VectorName => {
    switch (input) {
      case VectorName.N :
        return VectorName.S;
      case VectorName.S :
        return VectorName.N;
      case VectorName.E :
        return VectorName.W;
      case VectorName.W :
        return VectorName.E;
      case VectorName.NE:
        return VectorName.SW;
      case VectorName.SE:
        return VectorName.NW;
      case VectorName.SW:
        return VectorName.NE;
      case VectorName.NW:
        return VectorName.SE;
      default:
        return VectorName.None;
    }
  };

  // Make a list of files (columns) without existing pawns, per player.
  findOpenFiles = ( player: number, board: BoardModel ): number[] => {

    // Check to see if pawns are captured (otherwise there is no point in this process)
    const hasPawns = player == 1 
    ? board.CapturesP1.filter(capture => capture.Type === PieceType.Pawn)
    : board.CapturesP2.filter(capture => capture.Type === PieceType.Pawn);

    // All possible files (columns) to be filtered out.
    let openFiles = [ 1, 2, 3, 4 ,5, 6, 7, 8, 9 ];

    // Filter out files that already contain a player's unpromoted pawn.
    if(hasPawns.length > 0){
      board.Squares.forEach(s => {
        if( s.Piece.Type == PieceType.Pawn ){
          if( s.Piece.Player == player) { 
            openFiles = openFiles.filter(x => x != s.X);
          }
        }
      });
    }    
    return openFiles;
  };

}
