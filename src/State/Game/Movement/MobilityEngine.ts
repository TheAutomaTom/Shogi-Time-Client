import { BoardModel } from "../BoardModel";
import { PieceModel } from "../Pieces/PieceModel";
import { PieceRangeSet } from "../Pieces/PieceRange";
import { PieceType } from "../Pieces/PieceType";
import { SquareModel } from "../SquareModel";
import { TargetSquare } from "./TargetSquare";
import { TargetStatus } from "./TargetStatus";
import { VectorSet } from "./VectorSet";

export class MobilityEngine {
  logSubject = {enabled: false, x:7, y:3};
  logPhase = true;

  RebuildBoard = ( board: BoardModel ): BoardModel =>{
    if(this.logPhase) console.log("\r\nRebuildBoard ... ");
    this.rebuildSquares(board);
    board = this.rebuildDrops(board);
    
    const checks = this.detectCheckCondition(board.Squares);
    
    if(checks.length > 0){
      if(this.logPhase) console.log(`\r\nRebuildBoard/ checks.length = ${checks.length} ... `);
      
      if(this.logPhase){ 
        console.warn("Checks..."); 
        console.dir(board.Checks); 
      }

      checks.forEach(s =>
        board.Checks.push(
        new SquareModel(
          s.X, 
          s.Y, 
          s.PromotionZone,
          new PieceModel(
            s.Piece.Player,
            s.Piece.Type,
            s.Piece.StartingPosition,
            s.Piece.Icon,
            s.Piece.IsFacingDefault,
            s.Piece.MovementMap
          )
        ))
      );
      board.Checks = checks;
      board = this.HandleChecks( board );
    } else {
      board.Checks = [];
    }
    return board;
  };

  rebuildSquares = ( board: BoardModel ): SquareModel[] =>{
    if(this.logSubject.enabled){ console.log(`\r\n\r\nMobilityEngine.RebuildSquares()\r\nlogSubject: ${this.logSubject.x}, ${this.logSubject.y}`); }
    if(this.logPhase) console.log("\r\nrebuildSquares... ");

    // First iteration builds vector arrays evaluating each pieces' 
    //   complete movement range and determines targets' relation to origin.
    board.Squares.forEach( square => {
      if(square.Piece.Player != 0){
        square.Piece.VectorSet = this.evaluateVectors(
          board, 
          square.X, 
          square.Y,
          square.Piece,
          this.setPieceIsFacing(square.Piece.Player, square.Piece.IsFacingDefault)
        )
      }      
    });

    // Create flat maps for each piece 
    //   so squares know where to highlight valid moves.
    board.Squares.forEach( square => {
      if(square.Piece.Player != 0){
        square.Piece.MovementMap = [];        
        square.Piece.MovementMap.push( ...this.flattenMap(square) );
      }      
    });

    return board.Squares;
  };
  
  flattenMap = (square: SquareModel): TargetSquare[] => {
    let map = [] as TargetSquare[];
    square.Piece.VectorSet.N.forEach(target   => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    square.Piece.VectorSet.S.forEach(target   => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    square.Piece.VectorSet.E.forEach(target   => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    square.Piece.VectorSet.W.forEach(target   => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    square.Piece.VectorSet.NE.forEach(target  => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    square.Piece.VectorSet.NW.forEach(target  => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    square.Piece.VectorSet.SE.forEach(target  => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    square.Piece.VectorSet.SW.forEach(target  => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    square.Piece.VectorSet.K.forEach(target   => { if(target.Status != TargetStatus.Blocked) map.push(target); });    
    return map;
  };




  rebuildDrops  = ( board: BoardModel ): BoardModel =>{
    if(this.logPhase) console.log("\r\nrebuildDrops... ");
    
    // Make a list of columns that pawns can be placed on for each player.
    let openFilesP1 = this.findOpenFiles(1, board);
    let openFilesP2 = this.findOpenFiles(2, board);
        
    // Loop through captured pieces (player 1)
    board.CapturesP1.forEach(capture => {
      capture.MovementMap = [];
      board.Squares.forEach(s => {

        if(s.Piece.Player == 0){
          
          // If not pawn, lance, or night: add whole board
          if( capture.Type != PieceType.Pawn && capture.Type != PieceType.Lance && capture.Type != PieceType.Knight ){
            capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
          }
        
          // If lance: add all but last back row
          else if( capture.Type == PieceType.Lance && ((capture.Player == 1 &&  s.Y != 1) || (capture.Player == 2 && s.Y != 9)) ){
            capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
          }
        
          // If pawn: add all but last back row and other columns with existing pawns
          else if( capture.Type == PieceType.Pawn && ((capture.Player == 1 &&  s.Y != 1) || (capture.Player == 2 && s.Y != 9)) ){
            
            console.log(`\topenFilesP1...1`);
            if(capture.Player == 1 && openFilesP1.includes(s.X)){
              console.warn(`\r\nrebuildDrops: ${PieceType.Pawn}, Player ${capture.Player}, s.X ${s.X}, s.Y ${s.Y}`);
              console.log(`\topenFilesP1...2`);
              console.dir(openFilesP1);
              capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
            }

            if(capture.Player == 2 && openFilesP2.includes(s.X)){
              capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
            }

          }

          // If knight: add all but back 2 rows
          else if( (capture.Type == PieceType.Knight)
            && ((board.CurrentPlayer == 1 &&  (s.Y > 2)) || (board.CurrentPlayer == 2 && (s.Y < 8)))  )
          {
            capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
          }
        
        }
      });

    });
    
    // Loop through captured pieces (player 2)
    board.CapturesP2.forEach(capture => {
      capture.MovementMap = [];
      board.Squares.forEach(s => {

        if(s.Piece.Player == 0){
          
          // If not pawn, lance, or night: add whole board
          if( capture.Type != PieceType.Pawn && capture.Type != PieceType.Lance && capture.Type != PieceType.Knight ){
            capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
          }
        
          // If lance: add all but last back row
          else if( capture.Type == PieceType.Lance && ((capture.Player == 1 &&  s.Y != 1) || (capture.Player == 2 && s.Y != 9)) ){
            capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
          }
        
          // If pawn: add all but last back row and other columns with existing pawns
          else if( capture.Type == PieceType.Pawn && ((capture.Player == 1 &&  s.Y != 1) || (capture.Player == 2 && s.Y != 9)) ){
            
            console.log(`\topenFilesP1...1`);
            if(capture.Player == 1 && openFilesP1.includes(s.X)){
              console.warn(`\r\nrebuildDrops: ${PieceType.Pawn}, Player ${capture.Player}, s.X ${s.X}, s.Y ${s.Y}`);
              console.log(`\topenFilesP1...2`);
              console.dir(openFilesP1);
              capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
            }

            if(capture.Player == 2 && openFilesP2.includes(s.X)){
              capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
            }

          }

          // If knight: add all but back 2 rows
          else if( (capture.Type == PieceType.Knight)
            && ((board.CurrentPlayer == 1 &&  (s.Y > 2)) || (board.CurrentPlayer == 2 && (s.Y < 8)))  )
          {
            capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
          }
        
        }
      });

    });

    return board;

  };
  
  setPieceIsFacing = (player: number, isDefault: boolean): number =>{
    if(isDefault){
      return player == 1 ? -1 : 1;
    }
    return player == 1 ? 1 : -1;
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
            // console.log(`openFilesP1...filter BEFORE ${s.X}`);
            // console.dir(openFilesP1);
            openFiles = openFiles.filter(x => x != s.X); 
            // console.log(`openFilesP1...filter AFTER ${s.X}`);
            // console.dir(openFilesP1);
          }
        }
      });
    }    
    return openFiles;
  };


  evaluateVector = ( 
    piece: PieceModel, board: BoardModel, targetX: number, targetY: number, isBlocked: Boolean, isLogSubject: boolean = false
  ): TargetSquare =>{

    // Check board dimensions.
    if(targetX >= 1 && targetX <= 9 && targetY >= 1 && targetY <= 9){
          
      // Find the target square.
      const s = board.Squares.find( s => s.X == targetX && s.Y == targetY );
      if(s == undefined) return new TargetSquare(11, 11, TargetStatus.Na );

      switch (s?.Piece.Player) {
        
        case 0: // Open squares
          if(isBlocked){
            // if(isLogSubject){console.log(`\t${targetX}${targetY}: ${TargetStatus.Blocked} (isBlocked)`);}            
            const result = new TargetSquare(s.X, s.Y, TargetStatus.Blocked );
            return result;
            
          } else {
            // if(isLogSubject){console.log(`\t${targetX}${targetY}: ${TargetStatus.Open} (!isBlocked)`);}
            const result = new TargetSquare(s.X, s.Y, TargetStatus.Open );
            return result;
          }

        case piece.Player:
          if(isLogSubject){console.log(`\tpiece.Player: ${piece.Player}`);}
          if(isLogSubject){console.log(`\t${targetX}${targetY}: ${TargetStatus.Ally} (${s.Piece.Id})`);}
          return new TargetSquare(s.X, s.Y, TargetStatus.Ally );
      
        default: // Enemy

          if(isBlocked){
            if(isLogSubject){console.log(`\t${targetX}${targetY}: ${TargetStatus.Blocked} (isBlocked enemy)`);}
            const result = new TargetSquare(s.X, s.Y, TargetStatus.Blocked );
            return result;
            
          } else {
            
            // const isCheck = s.Piece.Type == PieceType.KingChallenger || PieceType.KingVictor;
            const isCheck = s.Piece.Type == PieceType.King;
            if( isCheck ){              
              if(isLogSubject){console.log(`\t${targetX}${targetY}: ${TargetStatus.Check} (!isBlocked enemy && isCheck)`);}
              const result = new TargetSquare(s.X, s.Y, TargetStatus.Check );
              return result;
            }
            if(isLogSubject){console.log(`\t${targetX}${targetY}: ${TargetStatus.Enemy} (!isBlocked enemy && !isCheck)`);}
            const result = new TargetSquare(s.X, s.Y, TargetStatus.Enemy );  
            return result;

          }




      }

    };
    return new TargetSquare(10, 10, TargetStatus.OutOfRange );
  }

  evaluateVectors = (
    board: BoardModel, originX: number, originY: number, piece: PieceModel, facing: number
  ): VectorSet => {
    
    let mobility = {} as VectorSet;
    const isLogSubject = this.logSubject.enabled && originX == this.logSubject.x && originY == this.logSubject.y;

    if(isLogSubject) console.warn(`isLogSubject? ${isLogSubject} (x: ${this.logSubject.x}, y: ${this.logSubject.y})`);
    let isBlocked = false;

    const rangeSet = piece.Range;

    // Process North ===============================================
    mobility.N=[];
    if(rangeSet.N > 0){
      if(isLogSubject){ console.log(`${originX}${originY}: Range N = ${rangeSet.N}`); }

      // Iterate each coordinate along one vector (ex: north)...
      for (let i = 1; i <= rangeSet.N; i++) {
        let x = originX;
        let y = originY + i * facing 
        
        const s = this.evaluateVector( piece, board, x, y, isBlocked, isLogSubject);
        isBlocked = this.isBlocked(s.Status, "N", isLogSubject);

        if(s.Status != TargetStatus.OutOfRange){
          mobility.N.push(s);
        }

      }
    }
    isBlocked = false;
    
    // Process South ===============================================
    mobility.S=[];
    if(rangeSet.S > 0){
      if(isLogSubject){ console.log(`${originX}${originY}: Range S = ${rangeSet.S}`); }
      for (let i = 1; i <= rangeSet.S; i++) {
        let x = originX;
        let y = originY - i * facing;
        const s = this.evaluateVector( piece, board, x, y, isBlocked, isLogSubject);
        isBlocked = this.isBlocked(s.Status, "S", isLogSubject);
        if(s.Status != TargetStatus.OutOfRange){
          mobility.S.push(s);
        }
      }
    }
    isBlocked = false;

    // Process East ================================================
    mobility.E=[];
    if(rangeSet.E > 0){
      if(isLogSubject){ console.log(`${originX}${originY}: Range E = ${rangeSet.E}`); }
    for (let i = 1; i <= rangeSet.E; i++) {    
          let x = originX - i * facing;
          let y = originY;
          const s = this.evaluateVector( piece, board, x, y, isBlocked, isLogSubject);
          isBlocked = this.isBlocked(s.Status, "E", isLogSubject);
          if(s.Status != TargetStatus.OutOfRange){
            mobility.E.push(s);
          }
      }
    }
    isBlocked = false;
      
    // Process West ================================================
    mobility.W=[];
    if(rangeSet.W > 0){
      if(isLogSubject){ console.log(`${originX}${originY}: Range W = ${rangeSet.W}`); }
      for (let i = 1; i <= rangeSet.W; i++) { 
          let x = originX + i * facing;
          let y = originY;
          const s = this.evaluateVector( piece, board, x, y, isBlocked, isLogSubject);
          isBlocked = this.isBlocked(s.Status, "W", isLogSubject);
          if(s.Status != TargetStatus.OutOfRange){
            mobility.W.push(s);
          }
      }
    }
    isBlocked = false;
      
    // Process North-West ==========================================
    mobility.NW=[];
    if(rangeSet.NW > 0){
      if(isLogSubject){ console.log(`${originX}${originY}: Range NW= ${rangeSet.NW}`); }
    for (let i = 1; i <= rangeSet.NW; i++) {  
        let x = originX + i * facing;
        let y = originY + i * facing;
        const s = this.evaluateVector( piece, board, x, y, isBlocked, isLogSubject);
        isBlocked = this.isBlocked(s.Status, "NW", isLogSubject);
        if(s.Status != TargetStatus.OutOfRange){
          mobility.NW.push(s);
        }
      }
    }
    isBlocked = false;
      
    // Process North-East ==========================================
    mobility.NE=[];
    if(rangeSet.NE > 0){
      if(isLogSubject){ console.log(`${originX}${originY}: Range NE= ${rangeSet.NE}`); }
      for (let i = 1; i <= rangeSet.NE; i++) {    
          let x = originX - i * facing;
          let y = originY + i * facing;
          const s = this.evaluateVector( piece, board, x, y, isBlocked, isLogSubject);
          isBlocked = this.isBlocked(s.Status, "NE", isLogSubject);
          if(s.Status != TargetStatus.OutOfRange){
            mobility.NE.push(s);
          }
      }
    }
    isBlocked = false;
        
    // Process South-East =========================================
    mobility.SE=[];
    if(rangeSet.SE > 0){
      if(isLogSubject){ console.log(`${originX}${originY}: Range SE= ${rangeSet.SE}`); }
      for (let i = 1; i <= rangeSet.SE; i++) {   
          let x = originX - i * facing;
          let y = originY - i * facing; 
          const s = this.evaluateVector( piece, board, x, y, isBlocked, isLogSubject);
          isBlocked = this.isBlocked(s.Status, "SE", isLogSubject);
          if(s.Status != TargetStatus.OutOfRange){
            mobility.SE.push(s);
          }
      }
    }
    isBlocked = false;
      
    // Process South-West ==========================================
    mobility.SW=[];
    if(rangeSet.SW > 0){
      if(isLogSubject){ console.log(`${originX}${originY}: Range SW= ${rangeSet.SW}`); }
      for (let i = 1; i <= rangeSet.SW; i++) {  
        let x = originX + i * facing;
        let y = originY - i * facing; 
        const s = this.evaluateVector( piece, board, x, y, isBlocked, isLogSubject);
        isBlocked = this.isBlocked(s.Status, "SW", isLogSubject);
        if(s.Status != TargetStatus.OutOfRange){
          mobility.SW.push(s);
        }
      }
    }
    isBlocked = false;
        
    // Process Knight ==============================================
    mobility.K=[];
    if(rangeSet.K > 0){
      if(isLogSubject){ console.log(`${originX}${originY}: Range K = ${rangeSet.K}`); }
      
        let targetX = originX + 1 * facing;
        let targetY = originY + 2 * facing;

      if( targetX > 0 && targetX < 10 && targetY > 0 && targetY < 10 ){
        board.Squares.forEach( square => {
          if(square.X == targetX && square.Y == targetY){
            const s = this.evaluateVector( piece, board, targetX, targetY, false, isLogSubject );
            if(s.Status != TargetStatus.OutOfRange){
              mobility.K.push(s);
            }
          }
        });
      }

      targetX = originX - 1 * facing;
      targetY = originY + 2 * facing;

      if( targetX > 0 && targetX < 10 && targetY > 0 && targetY < 10 ){
        board.Squares.forEach( square => {
          if(square.X == targetX && square.Y == targetY){
            const s = this.evaluateVector( piece, board, targetX, targetY, false, isLogSubject );
            if(s.Status != TargetStatus.OutOfRange){
              mobility.K.push(s);
            }
          }
        });
      }
    }
    
    return mobility;
  };
  

  isBlocked = (status: TargetStatus, vector: string = "", isLogSubject = false): boolean =>{
    if( vector != "" 
        && (status == TargetStatus.Blocked || status == TargetStatus.Ally || status == TargetStatus.Enemy || status == TargetStatus.Check) ){
      if(isLogSubject) console.log(`\t${vector} isBlocked: ${status}`);
      return true; 
    }
    return false;
  };

  //===================================================================================================================
 
  detectCheckCondition (squares: SquareModel[]): SquareModel[] {
    if(this.logPhase) console.log("\r\ndetectCheckCondition... ");

    let checks = [] as SquareModel[];

    squares.forEach(s => {
      if(s.Piece.Player != 0){
        var inCheck = s.Piece.MovementMap.some(p => p.Status == TargetStatus.Check);
        if(inCheck){

          checks.push(
            new SquareModel(
              s.X, 
              s.Y, 
              s.PromotionZone,
              new PieceModel(
                s.Piece.Player,
                s.Piece.Type,
                s.Piece.StartingPosition,
                s.Piece.Icon,
                s.Piece.IsFacingDefault,
                s.Piece.MovementMap
              )
            ));

          console.error(`inCheck from ${s.Id}'s ${s.Piece.Id} (${s.X}, ${s.Y})`);
        }
      }
    });

    return checks;
  }

  
  HandleChecks = ( board: BoardModel ): BoardModel =>{
    if(this.logPhase) console.log(`\r\nHandleChecks ... `);
    
    if(board.Checks.length == 0){ 
      return board;
    }

    const defender = board.Checks[0]?.Piece?.Player;
    if(defender != 0){
      const target = board.Squares.filter(s => 
        s.Piece.Player == defender 
        && s.Piece.Type == PieceType.King
      )[0];

      

    }

    board.Checks.forEach( attackVector => {
      target.Piece.MovementMap.filter( escapeVector => {
        escapeVector.Id != attackVector.Id
      });
      
    });

    return board;
  };


}
