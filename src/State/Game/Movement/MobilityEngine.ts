import { BoardModel } from "../BoardModel";
import { PieceRangeSet } from "../Pieces/PieceRange";
import { PieceType } from "../Pieces/PieceType";
import { SquareModel } from "../SquareModel";
import { TargetSquare } from "./TargetSquare";
import { TargetStatus } from "./TargetStatus";
import { VectorSet } from "./VectorSet";

export class MobilityEngine {
  
  logSubject = {enabled: true, x:8, y:6};

  RebuildBoard = ( board: BoardModel ): BoardModel =>{
    this.rebuildSquares(board);
    board = this.rebuildDrops(board);
    return board;
  };

  rebuildSquares = ( board: BoardModel ): SquareModel[] =>{
    if(this.logSubject.enabled){ console.log(`\r\n\r\nMobilityEngine.RebuildSquares()\r\nlogSubject: ${this.logSubject.x}, ${this.logSubject.y}`); }

    // First iteration builds vector arrays evaluating each pieces' 
    //   complete movement range and determines targets' relation to origin.
    board.Squares.forEach( square => {
      if(square.Piece.Player != 0){
        square.Piece.VectorSet = this.evaluateVectors(
          board, 
          square.X, 
          square.Y,
          square.Piece.Range,
          this.setPieceIsFacing(square.Piece.Player, square.Piece.IsFacingDefault)
        )
      }      
    });

    // Create flat maps for each piece 
    //   so squares know where to highlight valid moves.
    board.Squares.forEach( square => {
      if(square.Piece.Player != 0){
        square.Piece.MovementMap = [];        
        square.Piece.MovementMap.push( ...this.FlattenMap(square) );
      }
    });

    return board.Squares;
  };
  
  FlattenMap = (square: SquareModel): TargetSquare[] => {
    let map = [] as TargetSquare[];
    
    const toAddN = square.Piece.VectorSet.N.filter(t => t.Status != TargetStatus.Blocked)
    // console.log("toAddN " + toAddN.length);
    toAddN.forEach(target   => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    // console.dir(toAddN);

    square.Piece.VectorSet.S.forEach(target   => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    square.Piece.VectorSet.E.forEach(target   => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    square.Piece.VectorSet.W.forEach(target   => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    square.Piece.VectorSet.NE.forEach(target  => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    square.Piece.VectorSet.NW.forEach(target  => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    square.Piece.VectorSet.SE.forEach(target  => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    square.Piece.VectorSet.SW.forEach(target  => { if(target.Status != TargetStatus.Blocked) map.push(target); });
    return map;
  };

  rebuildDrops  = ( board: BoardModel ): BoardModel =>{
    
    // Make a list of columns that pawns can be placed on for each player.
    let openFilesP1 = [ 1, 2, 3, 4 ,5, 6, 7, 8, 9 ];
    const hasPawnsP1 = board.CapturesP1.filter(capture => capture.Type === PieceType.Pawn);
    let openFilesP2 = [ 1, 2, 3, 4 ,5, 6, 7, 8, 9 ];    
    const hasPawnsP2 = board.CapturesP2.filter(capture => capture.Type === PieceType.Pawn);
    if(hasPawnsP1.length + hasPawnsP2.length > 0){
      board.Squares.forEach(s => {
        if( s.Piece.Type == PieceType.Pawn ){
          if( s.Piece.Player == 1) { 
            console.log(`openFilesP1...filter BEFORE ${s.X}`);
            console.dir(openFilesP1);
            openFilesP1 = openFilesP1.filter(x => x != s.X); 
            console.log(`openFilesP1...filter AFTER ${s.X}`);
            console.dir(openFilesP1);
          }
          if( s.Piece.Player == 2) { 
            // console.log(`openFilesP2...filter ${s.X}`);
            openFilesP2 = openFilesP2.filter(x => x != s.X); 
          }
        }
      });
    }
    
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

    return board;

  };
  
  setPieceIsFacing = (player: number, isDefault: boolean): number =>{
    if(isDefault){
      return player == 1 ? -1 : 1;
    }
    return player == 1 ? 1 : -1;
  };

  evaluateVector = ( 
    board: BoardModel, targetX: number, targetY: number, isBlocked: Boolean, isLogSubject: boolean = false
  ): TargetSquare =>{

    // Check board dimensions.
    if(targetX >= 1 && targetX <= 9 && targetY >= 1 && targetY <= 9){
          
      // Find the target square.
      const s = board.Squares.find( s => s.X == targetX && s.Y == targetY );
      if(s == undefined) return new TargetSquare(11, 11, TargetStatus.Na );

      switch (s?.Piece.Player) {
        
        case 0: // This is an open square.
          if(isBlocked){
            const result = new TargetSquare(s.X, s.Y, TargetStatus.Blocked );
            if(isLogSubject){console.log(`\t${targetX},${targetY}: ${TargetStatus.Blocked} (isBlocked)`);}
            console.log(`\t${targetX},${targetY}: ${TargetStatus.Blocked}`);
            return result;
            
          } else {
            const result = new TargetSquare(s.X, s.Y, TargetStatus.Open );
            if(isLogSubject){console.log(`\t${targetX},${targetY}: ${TargetStatus.Open} (!isBlocked)`);}
            return result;
          }

        case board.CurrentPlayer:
          if(isLogSubject){console.log(`\t${targetX},${targetY}: ${TargetStatus.Ally}`);}
          return new TargetSquare(s.X, s.Y, TargetStatus.Ally );
      
        default: 
          if(isLogSubject){console.log(`\t${targetX},${targetY}: ${TargetStatus.Enemy}`);}
          if(isBlocked){
            const result = new TargetSquare(s.X, s.Y, TargetStatus.Blocked );
            if(isLogSubject){console.log(`\t${targetX},${targetY}: ${TargetStatus.Blocked} (isBlocked enemy)`);}
            console.log(`\t${targetX},${targetY}: ${TargetStatus.Blocked}`);
            return result;
            
          } else {
            const result = new TargetSquare(s.X, s.Y, TargetStatus.Enemy );  
            if(isLogSubject){console.log(`\t${targetX},${targetY}: ${TargetStatus.Open} (!isBlocked enemy)`);}
            return result;
          }




      }

    };
    return new TargetSquare(10, 10, TargetStatus.OutOfRange );
  }

  evaluateVectors = (
    board: BoardModel, originX: number, originY: number, rangeSet: PieceRangeSet, facing: number
  ): VectorSet => {
    
    let mobility = {} as VectorSet;
    const isLogSubject = this.logSubject.enabled && originX == this.logSubject.x && originY == this.logSubject.y;

    if(isLogSubject) console.warn(`isLogSubject? ${isLogSubject} (x: ${this.logSubject.x}, y: ${this.logSubject.y})`);
    let isBlocked = false;

    // Process North ===============================================
    mobility.N=[];
    if(rangeSet.N > 0){
      if(isLogSubject){ console.log(`${originX},${originY}: Range N  ${rangeSet.N}`); }

      // Iterate each coordinate along one vector (ex: north)...
      for (let i = 1; i <= rangeSet.N; i++) {
        let x = originX;
        let y = originY + i * facing 
        
        const s = this.evaluateVector( board, x, y, isBlocked, isLogSubject);
        
        if( s.Status == TargetStatus.Blocked || s.Status == TargetStatus.Ally || s.Status == TargetStatus.Enemy ){
          if(isLogSubject){ console.error(`${originX},${originY}: N isBlocked = ${isBlocked}`); }
          isBlocked = true;
        }

        if(s.Status != TargetStatus.OutOfRange){
          mobility.N.push(s);
        }

      }
    }
    isBlocked = false;
    
    // Process South ===============================================
    mobility.S=[];
    if(rangeSet.S > 0){
      if(isLogSubject){ console.log(`${originX},${originY}: Range S  ${rangeSet.S}`); }
      for (let i = 1; i <= rangeSet.S; i++) {
        let x = originX;
        let y = originY - i * facing;
        const s = this.evaluateVector( board, x, y, isBlocked, isLogSubject);    
        if( s.Status == TargetStatus.Blocked || s.Status == TargetStatus.Ally || s.Status == TargetStatus.Enemy ){
          if(isLogSubject){ console.error(`${originX},${originY}: S isBlocked = ${isBlocked}`); }
          isBlocked = true;
        }
        if(s.Status != TargetStatus.OutOfRange){
          mobility.S.push(s);
        }
      }
    }
    isBlocked = false;

    // Process East ================================================
    mobility.E=[];
    if(rangeSet.E > 0){
      if(isLogSubject){ console.log(`${originX},${originY}: Range E  ${rangeSet.E}`); }
    for (let i = 1; i <= rangeSet.E; i++) {    
          let x = originX - i * facing;
          let y = originY;
          const s = this.evaluateVector( board, x, y, isBlocked, isLogSubject);
          if( s.Status == TargetStatus.Blocked || s.Status == TargetStatus.Ally || s.Status == TargetStatus.Enemy ){
            if(isLogSubject){ console.error(`${originX},${originY}: E isBlocked = ${isBlocked}`); }
            isBlocked = true;
          }
          if(s.Status != TargetStatus.OutOfRange){
            mobility.E.push(s);
          }
      }
    }
    isBlocked = false;
      
    // Process West ================================================
    mobility.W=[];
    if(rangeSet.W > 0){
      if(isLogSubject){ console.log(`${originX},${originY}: Range W  ${rangeSet.W}`); }
      for (let i = 1; i <= rangeSet.W; i++) { 
          let x = originX + i * facing;
          let y = originY;
          const s = this.evaluateVector( board, x, y, isBlocked, isLogSubject);
          if( s.Status == TargetStatus.Blocked || s.Status == TargetStatus.Ally || s.Status == TargetStatus.Enemy ){
            if(isLogSubject){ console.error(`${originX},${originY}: W isBlocked = ${isBlocked}`); }
            isBlocked = true;
          }
          if(s.Status != TargetStatus.OutOfRange){
            mobility.W.push(s);
          }
      }
    }
    isBlocked = false;
      
    // Process North-West ==========================================
    mobility.NW=[];
    if(rangeSet.NW > 0){
      if(isLogSubject){ console.log(`${originX},${originY}: Range NW ${rangeSet.NW}`); }
    for (let i = 1; i <= rangeSet.NW; i++) {  
        let x = originX + i * facing;
        let y = originY + i * facing;
        const s = this.evaluateVector( board, x, y, isBlocked, isLogSubject);
        if( s.Status == TargetStatus.Blocked || s.Status == TargetStatus.Ally || s.Status == TargetStatus.Enemy ){
          if(isLogSubject){ console.error(`${originX},${originY}: NW isBlocked = ${isBlocked}`); }
          isBlocked = true;
        }
        if(s.Status != TargetStatus.OutOfRange){
          mobility.NW.push(s);
        }
      }
    }
    isBlocked = false;
      
    // Process North-East ==========================================
    mobility.NE=[];
    if(rangeSet.NE > 0){
      if(isLogSubject){ console.log(`${originX},${originY}: Range NE ${rangeSet.NE}`); }
      for (let i = 1; i <= rangeSet.NE; i++) {    
          let x = originX - i * facing;
          let y = originY + i * facing;
          const s = this.evaluateVector( board, x, y, isBlocked, isLogSubject);
          if( s.Status == TargetStatus.Blocked || s.Status == TargetStatus.Ally || s.Status == TargetStatus.Enemy ){
            if(isLogSubject){ console.error(`${originX},${originY}: NE isBlocked = ${isBlocked}`); }
            isBlocked = true;
          }
          if(s.Status != TargetStatus.OutOfRange){
            mobility.NE.push(s);
          }
      }
    }
    isBlocked = false;
        
    // Process South-East =========================================
    mobility.SE=[];
    if(rangeSet.SE > 0){
      if(isLogSubject){ console.log(`${originX},${originY}: Range SE ${rangeSet.SE}`); }
      for (let i = 1; i <= rangeSet.SE; i++) {   
          let x = originX - i * facing;
          let y = originY - i * facing; 
          const s = this.evaluateVector( board, x, y, isBlocked, isLogSubject);
          if( s.Status == TargetStatus.Blocked || s.Status == TargetStatus.Ally || s.Status == TargetStatus.Enemy ){
            if(isLogSubject){ console.error(`${originX},${originY}: SE isBlocked = ${isBlocked}`); }
            isBlocked = true;
          }
          if(s.Status != TargetStatus.OutOfRange){
            mobility.SE.push(s);
          }
      }
    }
    isBlocked = false;
      
    // Process South-West ==========================================
    mobility.SW=[];
    if(rangeSet.SW > 0){
      if(isLogSubject){ console.log(`${originX},${originY}: Range SW ${rangeSet.SW}`); }
      for (let i = 1; i <= rangeSet.SW; i++) {  
        let x = originX + i * facing;
        let y = originY - i * facing; 
        const s = this.evaluateVector( board, x, y, isBlocked, isLogSubject);
        if( s.Status == TargetStatus.Blocked || s.Status == TargetStatus.Ally || s.Status == TargetStatus.Enemy ){
          if(isLogSubject){ console.error(`${originX},${originY}: SW isBlocked = ${isBlocked}`); }
          isBlocked = true;
        }
        if(s.Status != TargetStatus.OutOfRange){
          mobility.SW.push(s);
        }
      }
    }
    isBlocked = false;
        
    // Process Knight ==============================================
    mobility.K=[];
    if(rangeSet.K > 0){
      if(isLogSubject){ console.log(`${originX},${originY}: Range K  ${rangeSet.K}`); }
      
        let targetX = originX + 1 * facing;
        let targetY = originY + 2 * facing;

      if( targetX > 0 && targetX < 10 && targetY > 0 && targetY < 10 ){
        board.Squares.forEach( square => {
          if(square.X == targetX && square.Y == targetY){
            const s = this.evaluateVector( board, targetX, targetY, isBlocked );
            if(s.Status != TargetStatus.OutOfRange){
              mobility.K.push(s);
            }
          }
        });
      }

      targetX = originX + -1 * facing;
      targetY = originY + 2 * facing;

      if( targetX > 0 && targetX < 10 && targetY > 0 && targetY < 10 ){
        board.Squares.forEach( square => {
          if(square.X == targetX && square.Y == targetY){
            const s = this.evaluateVector( board, targetX, targetY, isBlocked );
            if(s.Status != TargetStatus.OutOfRange){
              mobility.K.push(s);
            }
          }
        });
      }
    }
    
    return mobility;
  };
}


