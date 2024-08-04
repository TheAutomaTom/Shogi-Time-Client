import { BaseSquareModel } from "./Squares/BaseSquareModel";
import { BoardModel } from "./BoardModel";
import { GameSquareModel } from "./Squares/GameSquareModel";
import { Mobility } from "./Movement/Mobility";
import { PieceModel } from "./Pieces/PieceModel";
import { PieceType } from "./Pieces/PieceType";
import { TargetSquareModel } from "./Squares/TargetSquareModel";
import { TargetStatus } from "./Squares/TargetStatus";
import { Vector } from "./Movement/Vector";
import { VectorName } from "./Movement/VectorName";
import { VectorTargetReport } from "./Movement/VectorTargetReport";
import { AttackModel } from "./Movement/AttackModel";

export class MobilityEngine {
  // logSubject = {enabled: true, id: "P2-Rook-Right"};
  // logPhase = false;

  RebuildBoard = ( input: BoardModel ): BoardModel =>{

    let result = this.resetBoard(input);
    result = this.calculateStandardVectors(result);
    console.warn("\r\n defineAttackVectors...");
    result = this.defineAttackVectors(result);
    console.warn("\r\n constrainPinnedPieces...");
    result = this.constrainPinnedPieces(result);
    console.warn("\r\n redrawValidMoves...");
    result = this.redrawValidMoves(result);
    console.warn("\r\n rebuildDrops...");
    result = this.rebuildDrops(result);

    return result;
  };

  resetBoard = ( board: BoardModel ): BoardModel => {
    board.Squares.forEach(square => {
      if(square.Piece.Player != 0){
        const _ = square.Piece.ResetMobility();
      }      
    });
    board.Attacks = [];
    console.error("board.Attacks.length: " + board.Attacks.length);
    console.dir(board.Attacks);
    return board;
  };

  rebuildDrops  = ( board: BoardModel ): BoardModel =>{
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
            
            if(capture.Player == 1 && openFilesP1.includes(s.X)){
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
  
  // Finds all moves without consideration of how checks or pins affect individual movement.
  calculateStandardVectors = ( board: BoardModel ): BoardModel => {
    board.Squares.forEach( square => {
      if(square.Piece?.Player != 0){ // Empty squares actually have blank pieces assigned to Player 0.

        // const logSubject = this.logSubject.enabled && square.Piece.Id == this.logSubject.id;
        // if(logSubject) console.warn(`MobilityEngine.RebuildSquares()\r\n logSubject: ${this.logSubject.id}`); 

        square.Piece.Mobility = this.rebuildMobility(board, square);
      }      
    });
    return board;
  };
  
  // Second iteration finds attackers' checks and pins, and constrains movement on targets.
  defineAttackVectors = (board: BoardModel): BoardModel => {
    board.Squares.forEach(square => {

      let attackModel = new AttackModel(square);
      let defenders = [] as TargetSquareModel[];

      if (square.Piece.Player != 0) {
        square.Piece.Mobility.Vectors.forEach(vector => {
          if ( vector.Targets.some(t => t.Status == TargetStatus.Enemy
                                     || t.Status == TargetStatus.Check
                                     || t.Status == TargetStatus.BlockedCheck
          )){            
            // Walk the array starting from farthest square.
            for (let i = vector.Targets.length - 1; i > -1; i--) {
              
              if (vector.Targets[i].Status == TargetStatus.Check || vector.Targets[i].Status == TargetStatus.BlockedCheck) {
                attackModel.AttackVector = vector.Name;
                attackModel.Checked = new TargetSquareModel(
                  vector.Targets[i].X,
                  vector.Targets[i].Y,
                  vector.Targets[i].Status,
                  vector.Targets[i].Piece
                );
              }
              
              // Only count defenders after a check or blocked-check has been detected.
              if ( attackModel.Checked != null 
                   && vector.Targets[i].Status == TargetStatus.Enemy ) {
                  defenders.push( new TargetSquareModel(
                    vector.Targets[i].X,
                    vector.Targets[i].Y,
                    vector.Targets[i].Status,
                    vector.Targets[i].Piece
                  )
                );
              }
            }
            // If there are 2 or more enemies protecting the king, they can't both be pinned.
            if(defenders.length == 1){
              attackModel.Defender = defenders[0];
              board.Attacks.push(attackModel);
            }
          }
        });
      }
    });

    return board;
  };

  constrainPinnedPieces  = ( board: BoardModel ): BoardModel => {
    // Use the short list of attacks to filter out invalid moves that would put the player into check.

    console.log(`\t board.Attacks (length: ${board.Attacks.length})`);
    console.dir(board.Attacks);
    
    board.Attacks.forEach(attack => {
      console.log(`\t\t attack => `);
      // console.dir(attack);
      
      if(attack.IsPin){
        board.Squares.forEach(defender => {
          if(defender.Id == attack.Defender?.Id){
            // console.log(`\t defender.Id == attack.Defender?.Id (${defender.Id} == ${attack.Defender?.Id})`);
            const constraints = defender.Piece.Mobility.setConstraint(attack.AttackVector);
            // console.dir(constraints);
          }
        });
      }
      
    });
    return board;

  };




  // Create 2 flat maps including each piece's moves for Views to bind on after a piece is selected.
  redrawValidMoves = ( board: BoardModel ): BoardModel => {

    let p1Attacks = [] as TargetSquareModel[];
    let p2Attacks = [] as TargetSquareModel[];
    
    board.Squares.forEach( square => {

      if(square.Piece.Mobility.Map.length != 0) {
        console.log(`Mobility.Map for ${square.Piece.Id}...BEFORE`);
        console.dir(square.Piece.Mobility.Map);
      }

      // Empty squares actually have blank pieces assigned to Player 0.
      if(square.Piece?.Player == 0){
        if(square.Piece.Type != PieceType.None) console.error(`${square.Piece.Id}'s Player == 0, but piece type = ${square.Piece.Type} (${square.Piece.Id}).`);
        square.Piece = new PieceModel(0);
      
        // Everyone else needs updated moves.
      } else {
        
        // If this target is not pinned to the king...
        const pinning = square.Piece.Mobility.Vectors.filter(v => v.PinnedPiece != null);
        if(pinning.length == 0){
          
          square.Piece.Mobility.Vectors.forEach(vector => {
            vector.Targets.forEach( t => {
              if(t.Status == TargetStatus.Open || TargetStatus.Enemy || TargetStatus.Check || TargetStatus.EnemyPin){

                square.Piece.Mobility.Map.push(t);   
                square.Piece.Player == 1 ? p1Attacks.push(t) : p2Attacks.push(t);
              }
            });

          });
        /*
        // Else, constrain the piece to the pinned vector.
        } else {
    
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
        */
        } 
         
      } 
    });
    
    
    // Lastly, re-evaluate each King, now that we know where everything else can move.
    board.Squares.forEach( square => {
      if(square.Piece.Type == PieceType.King){
        if(square.Piece.Player == 1){
          // square.Piece.Mobility.Map = this.restrictKing(square.Piece.Mobility.Map, p2Attacks);
        } else {
          // square.Piece.Mobility.Map = this.restrictKing(square.Piece.Mobility.Map, p1Attacks);
        }
        
      }
    });

    return board;
  };

  // restrictKing = (moves: TargetSquareModel[], attacks: TargetSquareModel[]): TargetSquareModel[] => {
  //   attacks.filter(a => a.Status == TargetStatus.Open || TargetStatus.Enemy || TargetStatus.Check);

  //   const validAttacks = attacks.filter(attack => attack.Status == TargetStatus.Enemy || TargetStatus.Open);

  //   attacks.forEach(s => {
  //     if(s.X == 6 && s.Y == 3){
  //       console.error("...");
  //       console.dir(s);
  //     }
      
  //   });

  //   const validMoves = moves.filter(move => !validAttacks.some(attack => 
  //       attack.X == move.X 
  //       && attack.Y == move.Y
  //     ));
  //   return validMoves;

  // };

  flattenVectors = (vectors: Vector[]): BaseSquareModel[] =>{
    const map = [] as BaseSquareModel[];
    vectors.forEach(vector => {
      vector.Targets.forEach( t => 
        map.push(new BaseSquareModel(t.X, t.Y))
      )
    });
    return map;
  };
  
  rebuildMobility = ( board: BoardModel, square: GameSquareModel): Mobility => {
    
    // const isLogSubject = this.logSubject.enabled && square.Piece.Id == this.logSubject.id;
    const isLogSubject = false;
        
    // if(this.logPhase && isLogSubject) {
    //   console.warn("\t rebuildMobility 1... ");
    //   console.dir(square.Piece.Mobility);
    //   console.dir(square.Piece.Mobility.Vectors);
    //   // square.Piece.Mobility.Vectors.forEach(v => { console.log(`\t ${v.Name}`); });
    //   console.log(`\t pinnedTo.Name == ${pinnedTo.Name}`);
    // }

    const facing = this.setPieceIsFacing(square.Piece.Player, square.Piece.Mobility.IsFacingDefault);     

    let newVectors = [] as Vector[];
    square.Piece.Mobility.Vectors.forEach(vector => {
      const v = this.rebuildVector(vector, board, square, facing, isLogSubject);
      newVectors.push(v);        
    });
  
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
          isBlocked = target.Status != TargetStatus.Open;
          vector = vector.Update( target.Status, target.Square! );
        }
      }
      return vector;
    }

  };

  evaluateVectorTarget = (
    board: BoardModel, playersTurn: number, targetId: string, isBlocked: boolean, isLogSubject: boolean
  ): VectorTargetReport => {

    if(isLogSubject) console.warn("\t\t\t\t evaluateVectorTarget 1: " + targetId); 
     const toLog = targetId == "DISABLED"; //"S28";

    // Find the target square.
    const s = board.Squares.find( s => s.Id == targetId );
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
        if(isLogSubject || toLog) {
            console.log("\t\t\t\t evaluateVectorTarget 2: Player #" + s?.Piece.Player + "'s Enemy"); 
        }
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
