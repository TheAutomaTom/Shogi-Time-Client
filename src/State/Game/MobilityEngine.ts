import { AttackModel } from "./Movement/AttackModel";
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

export class MobilityEngine {
  // logSubject = {enabled: true, id: "P2-Rook-Right"};
  logPhase = false;
  logDropCalcs = false;

  RebuildBoard = ( input: BoardModel ): BoardModel =>{

    let result = this.resetBoard(input);

    result = this.calculateStandardVectors(result);
    result = this.redrawDropViewModels(result, input.CurrentPlayer);
    result.Pins = this.definePinningAttackVectors(result);
    result = this.pinDefendersInLineOfFire(result);

    // Player 1...
    result = this.defineMustBlockOrKill(result, 1);
    if(result.P1ToBlock.length + result.P1ToKill.length > 0) {
      if(this.logPhase) console.log("Call constrainDefenders P1? " + (result.P1ToBlock.length + result.P1ToKill.length > 0));
      result = this.constrainDefendersMobility(result, 1, result.P1ToBlock, result.P1ToKill);
    }

    // if(result.IsMateBeforeDropsP1) result = this.counterMateWithDrops(result, 1);
    
    // if(result.IsInMate) return result;


    // Player 2...
    result = this.defineMustBlockOrKill(result, 2);
    if(result.P2ToBlock.length + result.P2ToKill.length > 0) {
      if(this.logPhase) console.log("Call constrainDefenders P2? " + (result.P2ToBlock.length + result.P2ToKill.length > 0));
      result = this.constrainDefendersMobility(result, 2, result.P2ToBlock, result.P2ToKill);
    }


    // if(result.IsMateBeforeDropsP2) result = this.counterMateWithDrops(result, 1);

    // if(result.IsInMate) return result;    


    
    result = this.redrawMovementViewModels(result);
    return result;
  };
  
  counterMateWithDrops = ( board: BoardModel, player: number ): BoardModel => { 
    const captures = player == 1 ? board.P1Captures : board.P2Captures;    
    if(captures.length == 0){
      board.IsInMate = player;
      return board;
    }    
    let foundBlock = false;
    const toBlock = player == 1 ? board.P1ToBlock : board.P2ToBlock;

    captures.forEach(capture => {
      capture.Mobility.Map.forEach(drop => {        
        if(toBlock.some(s => s.X == drop.X && s.Y == drop.Y)){
          // This capture could block check.
          foundBlock = true;
        }        
      });      
    });

    if(foundBlock == false) board.IsInMate = player;
    return board;
  };
  
  
  // Find all squares with pieces putting king in check or pinning defenders.
  // This operates on the attacker's pieces, starting from their furthest vector coordinate, walking back to their origin.
  defineMustBlockOrKill = ( board: BoardModel, player: number ): BoardModel => {
    if(this.logPhase) console.warn(`\r\n handleCheck...Player #${player}`);
    const toLog = true;
    let toBlock = [] as TargetSquareModel[];
    let toKill   = [] as TargetSquareModel[];

    if(toLog) console.log(`\r\n Phase 1...`);
    board.Squares.forEach(square => {
      if( square.Piece.Player != 0 && square.Piece.Player != player ){
        square.Piece.Mobility.Vectors.forEach(vector => {
          
          if( vector.Targets.some(t => t.Status == TargetStatus.Check )){
            // Walk the array starting from farthest square.
            for (let i = vector.Targets.length - 1; i > -1; i--) {
              let attackModel = new AttackModel(square);

              // The process does not begin until the King is found.
              if( vector.Targets[i].Status == TargetStatus.Check ){
                attackModel.AttackVector = vector.Name;
                attackModel.Checked = new TargetSquareModel( 
                                            vector.Targets[i].X,
                                            vector.Targets[i].Y,
                                            vector.Targets[i].Status,
                                            vector.Targets[i].Piece
                                          );
                // Add vector's origin (attacker) to the kill list.  Note: drops cannot counter this square.
                toKill.push( new TargetSquareModel(
                                            square.X,
                                            square.Y,
                                            TargetStatus.Enemy,
                                            square.Piece
                                          ));

                if(toLog) console.log(`\t Check detected: ${vector.Targets[i].Id} by ${square.Piece.Id} `);
              }
              
              // Only count open spaces after check has been detected (there shouldn't be other kinds).
              if( attackModel.Checked?.Id != "" 
                  && vector.Targets[i].Status != TargetStatus.Check 
                  && vector.Targets[i].Status != TargetStatus.CheckBlocks
                ) {
                toBlock.push( new TargetSquareModel(
                                            vector.Targets[i].X,
                                            vector.Targets[i].Y,
                                            vector.Targets[i].Status,
                                            vector.Targets[i].Piece
                                          ));
                if(toLog) console.log(`\t squaresToBlock: ${vector.Targets[i].Id} by ${square.Piece.Id} (${vector.Targets[i].Status}) `);
              }
            }
          }
        });
      }      
    });

    if(player == 1) {
      board.P1ToBlock = toBlock;
      board.P1ToKill = toKill;
    } else {
      board.P2ToBlock = toBlock;
      board.P2ToKill = toKill;
    }
    return board;
  };


  // Remove movement that cannot break a check condition, if one exists
  constrainDefendersMobility = ( board: BoardModel, player: number, squaresToBlock: TargetSquareModel[], squaresToKill: TargetSquareModel[] ): BoardModel => {
    const toLog = true;
    const toLogId = "P2-Rook-Right";
    let canBlockCheck = false;

    if(toLog) console.log(`\r\n Phase 2...`);
    board.Squares.forEach( square => {
      // If this is the player's piece, but not their King.
      if( square.Piece.Player == player && square.Piece.Type != PieceType.King){
        if(toLog && toLogId == square.Piece.Id) console.log(`\t ${square.Piece.Id}...`);
        
        // Clear the piece's default movement.
        const defaultVectors = square.Piece.Mobility.Vectors;
        square.Piece.Mobility.Vectors = [];

        defaultVectors.forEach(defaultVector => {
          let newVector = new Vector(defaultVector.Name);
          if(toLog && toLogId == square.Piece.Id) console.log(`\t Testing ${newVector}...`);
          
          defaultVector.Targets.forEach(target => {
            // If this target is in the list of squares required for defense, keep it.
            if( squaresToBlock.some( s => s.Id == target.Id ) || squaresToKill.some( s => s.Id == target.Id ) ){              
              
              newVector.Targets.push( new TargetSquareModel(target.X, target.Y, target.Status, target.Piece) );
              square.Piece.Mobility.Vectors.push(newVector);
              if(toLog && toLogId == square.Piece.Id) {
                console.log(`\t Adding vector: ${newVector.Name}...`);
                console.dir(newVector);
              }

              canBlockCheck = true;
              if(toLog) console.log(`\t Target ${target.Id} is in squaresTo Block or Kill`);
            }
          });
        });
      }
    });

    const captures = player == 1 ? board.P1Captures : board.P2Captures;    
    captures.forEach(capture => {

      // Clear the piece's default movement.
      const defaultDrops = capture.Mobility.Map;
      capture.Mobility.Map = [];

      defaultDrops.forEach( target => {

        if( squaresToBlock.some( s => s.Id == target.Id ) ){
          capture.Mobility.Map.push( new TargetSquareModel(target.X, target.Y, target.Status, target.Piece) );
          canBlockCheck = true;
          if(toLog) console.log(`\t Drop ${target.Id} is in squaresToBlock`);
        }

      });
    });
   
    
    if(!canBlockCheck && player == 1){ board.P1IsMateBeforeDrops = true; }
    if(!canBlockCheck && player == 2){ board.P2IsMateBeforeDrops = true; }
    return board;
  };

  resetBoard = ( board: BoardModel ): BoardModel => {
    if(this.logPhase) console.warn("\r\n resetBoard...");
    board.Squares.forEach(square => {
      if(square.Piece.Player != 0){
        // const _ = 
        square.Piece.ResetMobility();
      }
    });
    board.Pins = [];
    return board;
  };
  
  // Finds all moves without consideration of how checks or pins affect individual movement.
  calculateStandardVectors = ( board: BoardModel ): BoardModel => {
    if(this.logPhase) console.warn("\r\n calculateStandardVectors...");
    board.Squares.forEach( square => {
      if(square.Piece?.Player != 0){ // Empty squares actually have blank pieces assigned to Player 0.
        square.Piece.Mobility = this.rebuildMobility(board, square);
      }      
    });
    return board;
  };
  
  // Second iteration finds attackers' checks and pins, and constrains movement on targets.
  definePinningAttackVectors = (board: BoardModel): AttackModel[] => {
    if(this.logPhase) console.warn("\r\n constrainPinnedPieces...");

    let pins = [] as AttackModel[];

    board.Squares.forEach(square => {

      let attackModel = new AttackModel(square);
      let defenders = [] as TargetSquareModel[];
      let obstructions = [] as TargetSquareModel[];

      if (square.Piece.Player != 0) {        
        square.Piece.Mobility.Vectors.forEach(vector => {
                  
          if( vector.Targets.some(t => t.Status == TargetStatus.BlockedCheck )){
            // Walk the array starting from farthest square.
            for (let i = vector.Targets.length - 1; i > -1; i--) {              
              
              // The process doesn't begin unless the King is found to be in potential danger.
              if( vector.Targets[i].Status == TargetStatus.BlockedCheck){
                attackModel.AttackVector = vector.Name;
                attackModel.Checked = new TargetSquareModel(
                  vector.Targets[i].X,
                  vector.Targets[i].Y,
                  vector.Targets[i].Status,
                  vector.Targets[i].Piece
                );
              }
              
              // Only count defenders after a check or blocked-check has been detected.
              if( attackModel.Checked?.Id != ""
                  && vector.Targets[i].Status == TargetStatus.Enemy ) {
                  defenders.push( new TargetSquareModel(
                    vector.Targets[i].X,
                    vector.Targets[i].Y,
                    vector.Targets[i].Status,
                    vector.Targets[i].Piece
                  )
                );              
              }

              // If an Ally obstructs the king, no one is pinned.
              if( attackModel.Checked?.Id != ""
                  && (vector.Targets[i].Status == TargetStatus.Ally
                   || vector.Targets[i].Status == TargetStatus.EnemyBlocksEnemy
                  ) 
                
                ) {
                  obstructions.push( new TargetSquareModel(
                    vector.Targets[i].X,
                    vector.Targets[i].Y,
                    vector.Targets[i].Status,
                    vector.Targets[i].Piece
                  )
                );
              }
            }
            // If there are 2 or more enemies or any allies protecting the king, then no one is pinned.
            if(defenders.length == 1 && obstructions.length == 0){
              attackModel.Defender = defenders[0];
              pins.push(attackModel);
            }
          }

        });
      }
    });
    return pins;
  };

  // Use the short list of pins to restrict pieces to the king's line of sight.
  pinDefendersInLineOfFire  = ( board: BoardModel ): BoardModel => {
    if(this.logPhase) console.warn("\r\n constrainPinnedPieces...");
    board.Pins.forEach(attack => {      
      if(attack.IsPin){
        board.Squares.forEach(defender => {
          if(defender.Id == attack.Defender?.Id){
            const _ = defender.Piece.Mobility.setConstraint(attack.AttackVector);
          }
        });
      }      
    });
    return board;
  };
  
  // Create 2 flat maps including each piece's moves for Views to bind on after a piece is selected.
  redrawMovementViewModels = ( board: BoardModel ): BoardModel => {
    if(this.logPhase) console.warn("\r\n redrawValidMoves...");
    let p1Controlled = [] as TargetSquareModel[];
    let p2Controlled = [] as TargetSquareModel[];
    
    board.Squares.forEach( square => {
      // Empty squares actually have blank pieces assigned to Player 0.
      if(square.Piece?.Player == 0){
        if(square.Piece.Type != PieceType.None) console.error(`${square.Piece.Id}'s Player == 0, but piece type = ${square.Piece.Type} (${square.Piece.Id}).`);
        square.Piece = new PieceModel(0);
      
      // Everyone else needs updated moves.
      } else {
        square.Piece.Mobility.Vectors.forEach(vector => {
          vector.Targets.forEach( t => {            
            if(t.Status == TargetStatus.Open || t.Status == TargetStatus.Enemy || t.Status == TargetStatus.Check || t.Status == TargetStatus.CheckBlocks){
              square.Piece.Mobility.Map.push(t);
              square.Piece.Player == 1 ? p1Controlled.push(t) : p2Controlled.push(t);
            }
          });
        });
         
      } 
    });
    
    // Lastly, re-evaluate each King, now that we know where everything else can move.
    board.Squares.forEach( square => {
      if(square.Piece.Type == PieceType.King){
        if(square.Piece.Player == 1){
          square.Piece.Mobility.Map = this.restrictKing(square.Piece.Mobility.Map, p2Controlled);
        } else {
          square.Piece.Mobility.Map = this.restrictKing(square.Piece.Mobility.Map, p1Controlled);
        }        
      }
    });

    return board;
  };


  restrictKing = (moves: TargetSquareModel[], attacks: TargetSquareModel[]): TargetSquareModel[] => {
    attacks.filter(a => a.Status == TargetStatus.Open || TargetStatus.Enemy || TargetStatus.Check);
    const validAttacks = attacks.filter(attack => attack.Status == TargetStatus.Enemy || TargetStatus.Open);
    const validMoves = moves.filter(move => !validAttacks.some(attack => attack.X == move.X && attack.Y == move.Y));
    return validMoves;
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
  
  rebuildMobility = ( board: BoardModel, square: GameSquareModel): Mobility => {
    
    const facing = this.setPieceIsFacing(square.Piece.Player, square.Piece.Mobility.IsFacingDefault);     

    let newVectors = [] as Vector[];
    square.Piece.Mobility.Vectors.forEach(vector => {
      const v = this.rebuildVector(vector, board, square, facing);
      newVectors.push(v);        
    });
  
    return square.Piece.Mobility;
  };
  
  rebuildVector = ( vector: Vector, board: BoardModel, square: GameSquareModel, facing: number ): Vector => {
    
    // Knights only...
    if(vector.Name == VectorName.K){
      let targetX = square.X + 1 * facing;
      let targetY = square.Y + 2 * facing;
      if( targetX > 0 && targetX < 10 && targetY > 0 && targetY < 10 ){
        const target = this.evaluateVectorTarget( board, square.Piece.Player, this.squareId(targetX, targetY), TargetStatus.Na );
        vector = vector.Update( target.Status, target.Square! );
        
      }
      targetX = square.X + -1 * facing;
      targetY = square.Y + 2 * facing;
      if( targetX > 0 && targetX < 10 && targetY > 0 && targetY < 10 ){
        const target = this.evaluateVectorTarget( board, square.Piece.Player, this.squareId(targetX, targetY), TargetStatus.Na );
        vector = vector.Update( target.Status, target.Square! );
        
      }
      return vector;

    // Anything except Knights...
    } else { 
      let squareBeforeStatus = TargetStatus.Na;
      
      // Iterate each coordinate along one vector (ex: north)...
      for (let i = 1; i <= vector.Range; i++) {
      
        const targetX = vector.XIncrement == 0 ? square.X 
                                               : square.X + i * vector.XIncrement * facing;
        const targetY = vector.YIncrement == 0 ? square.Y 
                                               : square.Y + i * vector.YIncrement * facing;
        
        if( targetX > 0 && targetX < 10 && targetY > 0 && targetY < 10 ){          
          const squareId = this.squareId(targetX, targetY);

          // if(square.Piece.Id == "P1-Rook-Right" && ["S61", "S62", "S63", "S64", "S65", "S66", "87"].includes(squareId)){ 
          //   console.log(`${square.Piece.Id} evaluateVectorTarget...`)
          // };

          const target = this.evaluateVectorTarget( board, square.Piece.Player, squareId, squareBeforeStatus );
          
          squareBeforeStatus = target.Status;
          vector = vector.Update( target.Status, target.Square! );

        }
      }
      return vector;
    }

  };

  evaluateVectorTarget = ( board: BoardModel, playersTurn: number, targetId: string, squareBeforeStatus: TargetStatus ): VectorTargetReport => {
    
    const toLog = false; // ["S61", "S62", "S63", "S64", "S65", "S66", "87"].includes(targetId);

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
      
      case playersTurn:
        switch (squareBeforeStatus) {
          case TargetStatus.Open:
          case TargetStatus.Na:   
            status = TargetStatus.Ally;
            break;
          case TargetStatus.Ally:
          case TargetStatus.AllyBlocks:
            status = TargetStatus.AllyBlocks;
            break;
          case TargetStatus.Enemy:
          case TargetStatus.EnemyBlocksOpen:
            status = TargetStatus.EnemyBlocksOpen;
            break;
          case TargetStatus.Check:
          case TargetStatus.BlockedCheck:
            status = TargetStatus.CheckBlocks;
            break;
          default:
            status = TargetStatus.Na;
            break;
        }
        if(toLog){ console.log(`${targetId} case Ally: obstruction: ${squareBeforeStatus}, status: ${status}`); }
        break;

      case 0: // Open squares
        switch (squareBeforeStatus) {
          case TargetStatus.Open:
          case TargetStatus.Na:
            status = TargetStatus.Open;
            break;
          case TargetStatus.Ally:
          case TargetStatus.AllyBlocks:
            status = TargetStatus.AllyBlocks;
            break;
              
          case TargetStatus.Enemy:
          case TargetStatus.EnemyBlocksOpen:
          case TargetStatus.EnemyBlocksEnemy:
          case TargetStatus.BlockedCheck:
            status = TargetStatus.EnemyBlocksOpen;
            break;

          case TargetStatus.Check:
          case TargetStatus.CheckBlocks:
            status = TargetStatus.CheckBlocks;
            break;
          default:
            status = TargetStatus.Na;
            break;
        }
        if(toLog){ console.log(`${targetId} case Open: obstruction: ${squareBeforeStatus}, status: ${status}`); }
        break;
    
      default: // Enemy
        if( s.Piece.Type == PieceType.King ){
          switch (squareBeforeStatus) {
            case TargetStatus.Open:
            case TargetStatus.Na:
              status = TargetStatus.Check;
              break;
            case TargetStatus.AllyBlocks:
            case TargetStatus.Ally:
              status = TargetStatus.AllyBlocks;
              break;
            case TargetStatus.Enemy:
            case TargetStatus.EnemyBlocksOpen:
            case TargetStatus.EnemyBlocksEnemy:
            // case TargetStatus.Check:
            // case TargetStatus.BlockedCheck:
              status = TargetStatus.BlockedCheck;
              break;
            default:
              status = TargetStatus.Na;
              break;
          }
          if(toLog){ console.log(`${targetId} case Enemy-King: obstruction: ${squareBeforeStatus}, status: ${status}`); }
          break;

        } else { //s.Piece.Type != PieceType.King
          switch (squareBeforeStatus) {
            case TargetStatus.Open:
            case TargetStatus.Na:
              status = TargetStatus.Enemy;
              break;
            case TargetStatus.Enemy:
            case TargetStatus.EnemyBlocksOpen:
            case TargetStatus.EnemyBlocksEnemy:
            case TargetStatus.Check:
            case TargetStatus.BlockedCheck:
              status = TargetStatus.EnemyBlocksEnemy;
              break;
            case TargetStatus.Ally:
            case TargetStatus.AllyBlocks:
              status = TargetStatus.AllyBlocks;
              break;
            default:
              status = TargetStatus.Na;
              break;
          }
          if(toLog){ console.log(`${targetId} case Enemy: obstruction: ${squareBeforeStatus}, status: ${status}`); }
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
    ? board.P1Captures.filter(capture => capture.Type === PieceType.Pawn)
    : board.P2Captures.filter(capture => capture.Type === PieceType.Pawn);

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

  redrawDropViewModels  = ( board: BoardModel, player: number ): BoardModel =>{
    if(this.logPhase || this.logDropCalcs) console.warn("\r\n redrawDropViewModels...");
    player == 1 ? board.P1HasOpenFiles = false : board.P2HasOpenFiles = false;
    
    let openFiles = this.findOpenFiles(player, board);
    
    if(openFiles.length > 0){      
      player == 1 ? board.P1HasOpenFiles = true : board.P2HasOpenFiles = true;
    } 

    let captures = player == 1 ? board.P1Captures : board.P2Captures;

    captures.forEach(capture => {
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
            
            if(openFiles.includes(s.X)){
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






}
