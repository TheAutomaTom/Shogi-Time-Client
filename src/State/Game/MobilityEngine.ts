// import { BoardModel } from "./BoardModel";
// import { PieceModel } from "./Pieces/PieceModel";
// import { PieceType } from "./Pieces/PieceType";
// import { GameSquareModel } from "./GameSquareModel";
// import { TargetStatus } from "./Movement/TargetStatus";

// export class MobilityEngine {
//   logSubject = {enabled: false, x:7, y:3};
//   logPhase = true;

//   RebuildBoard = ( board: BoardModel ): BoardModel =>{
//     if(this.logPhase) console.log("\r\nRebuildBoard ... ");
//     this.rebuildSquares(board);
//     board = this.rebuildDrops(board);
    
//     const checks = this.detectCheckCondition(board.Squares);
    
//     if(checks.length > 0){
//       if(this.logPhase) console.log(`\r\nRebuildBoard/ checks.length = ${checks.length} ... `);
      
//       if(this.logPhase){ 
//         console.warn("Checks..."); 
//         console.dir(board.Checks); 
//       }

//       checks.forEach(s =>
//         board.Checks.push(
//         new GameSquareModel(
//           s.X, 
//           s.Y, 
//           s.PromotionZoneFor,
//           new PieceModel(
//             s.Piece.Player,
//             s.Piece.Type,
//             s.Piece.StartingPosition,
//             s.Piece.Icon,
//             s.Piece.Mobility.IsFacingDefault
//           )
//         ))
//       );
//       board.Checks = checks;
//       board = this.HandleChecks( board );
//     } else {
//       board.Checks = [];
//     }
//     return board;
//   };

//   rebuildSquares = ( board: BoardModel ): GameSquareModel[] =>{
//     if(this.logSubject.enabled){ console.log(`\r\n\r\nMobilityEngine.RebuildSquares()\r\nlogSubject: ${this.logSubject.x}, ${this.logSubject.y}`); }
//     if(this.logPhase) console.log("\r\nrebuildSquares... ");

//     // First iteration builds vector arrays evaluating each pieces' 
//     //   complete movement range and determines targets' relation to origin.
//     board.Squares.forEach( square => {
//       if(square.Piece.Player != 0){
//         square.Piece.Mobility = this.evaluateVectors(
//           board, 
//           square.X, 
//           square.Y,
//           square.Piece,
//           this.setPieceIsFacing(square.Piece.Player, square.Piece.IsFacingDefault)
//         )
//       }      
//     });

//     // Create flat maps for each piece 
//     //   so squares know where to highlight valid moves.
//     board.Squares.forEach( square => {
//       if(square.Piece.Player != 0){
//         square.Piece.MovementMap = [];        
//         square.Piece.MovementMap.push( ...this.flattenMap(square) );
//       }      
//     });

//     return board.Squares;
//   };
  
//   flattenMap = (square: GameSquareModel): TargetSquare[] => {
//     let map = [] as TargetSquare[];
//     square.Piece.Mobility.N.forEach(target   => { if(target.Status != TargetStatus.Blocked) map.push(target); });
//     square.Piece.Mobility.S.forEach(target   => { if(target.Status != TargetStatus.Blocked) map.push(target); });
//     square.Piece.Mobility.E.forEach(target   => { if(target.Status != TargetStatus.Blocked) map.push(target); });
//     square.Piece.Mobility.W.forEach(target   => { if(target.Status != TargetStatus.Blocked) map.push(target); });
//     square.Piece.Mobility.NE.forEach(target  => { if(target.Status != TargetStatus.Blocked) map.push(target); });
//     square.Piece.Mobility.NW.forEach(target  => { if(target.Status != TargetStatus.Blocked) map.push(target); });
//     square.Piece.Mobility.SE.forEach(target  => { if(target.Status != TargetStatus.Blocked) map.push(target); });
//     square.Piece.Mobility.SW.forEach(target  => { if(target.Status != TargetStatus.Blocked) map.push(target); });
//     square.Piece.Mobility.K.forEach(target   => { if(target.Status != TargetStatus.Blocked) map.push(target); });    
//     return map;
//   };




//   rebuildDrops  = ( board: BoardModel ): BoardModel =>{
//     if(this.logPhase) console.log("\r\nrebuildDrops... ");
    
//     // Make a list of columns that pawns can be placed on for each player.
//     let openFilesP1 = this.findOpenFiles(1, board);
//     let openFilesP2 = this.findOpenFiles(2, board);
        
//     // Loop through captured pieces (player 1)
//     board.CapturesP1.forEach(capture => {
//       capture.MovementMap = [];
//       board.Squares.forEach(s => {

//         if(s.Piece.Player == 0){
          
//           // If not pawn, lance, or night: add whole board
//           if( capture.Type != PieceType.Pawn && capture.Type != PieceType.Lance && capture.Type != PieceType.Knight ){
//             capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
//           }
        
//           // If lance: add all but last back row
//           else if( capture.Type == PieceType.Lance && ((capture.Player == 1 &&  s.Y != 1) || (capture.Player == 2 && s.Y != 9)) ){
//             capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
//           }
        
//           // If pawn: add all but last back row and other columns with existing pawns
//           else if( capture.Type == PieceType.Pawn && ((capture.Player == 1 &&  s.Y != 1) || (capture.Player == 2 && s.Y != 9)) ){
            
//             console.log(`\topenFilesP1...1`);
//             if(capture.Player == 1 && openFilesP1.includes(s.X)){
//               console.warn(`\r\nrebuildDrops: ${PieceType.Pawn}, Player ${capture.Player}, s.X ${s.X}, s.Y ${s.Y}`);
//               console.log(`\topenFilesP1...2`);
//               console.dir(openFilesP1);
//               capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
//             }

//             if(capture.Player == 2 && openFilesP2.includes(s.X)){
//               capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
//             }

//           }

//           // If knight: add all but back 2 rows
//           else if( (capture.Type == PieceType.Knight)
//             && ((board.CurrentPlayer == 1 &&  (s.Y > 2)) || (board.CurrentPlayer == 2 && (s.Y < 8)))  )
//           {
//             capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
//           }
        
//         }
//       });

//     });
    
//     // Loop through captured pieces (player 2)
//     board.CapturesP2.forEach(capture => {
//       capture.MovementMap = [];
//       board.Squares.forEach(s => {

//         if(s.Piece.Player == 0){
          
//           // If not pawn, lance, or night: add whole board
//           if( capture.Type != PieceType.Pawn && capture.Type != PieceType.Lance && capture.Type != PieceType.Knight ){
//             capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
//           }
        
//           // If lance: add all but last back row
//           else if( capture.Type == PieceType.Lance && ((capture.Player == 1 &&  s.Y != 1) || (capture.Player == 2 && s.Y != 9)) ){
//             capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
//           }
        
//           // If pawn: add all but last back row and other columns with existing pawns
//           else if( capture.Type == PieceType.Pawn && ((capture.Player == 1 &&  s.Y != 1) || (capture.Player == 2 && s.Y != 9)) ){
            
//             console.log(`\topenFilesP1...1`);
//             if(capture.Player == 1 && openFilesP1.includes(s.X)){
//               console.warn(`\r\nrebuildDrops: ${PieceType.Pawn}, Player ${capture.Player}, s.X ${s.X}, s.Y ${s.Y}`);
//               console.log(`\topenFilesP1...2`);
//               console.dir(openFilesP1);
//               capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
//             }

//             if(capture.Player == 2 && openFilesP2.includes(s.X)){
//               capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
//             }

//           }

//           // If knight: add all but back 2 rows
//           else if( (capture.Type == PieceType.Knight)
//             && ((board.CurrentPlayer == 1 &&  (s.Y > 2)) || (board.CurrentPlayer == 2 && (s.Y < 8)))  )
//           {
//             capture.MovementMap.push(new TargetSquare(s.X, s.Y, TargetStatus.Open));
//           }
        
//         }
//       });

//     });

//     return board;

//   };
  
//   setPieceIsFacing = (player: number, isDefault: boolean): number =>{
//     if(isDefault){
//       return player == 1 ? -1 : 1;
//     }
//     return player == 1 ? 1 : -1;
//   };
  
//   // Make a list of files (columns) without existing pawns, per player.
//   findOpenFiles = ( player: number, board: BoardModel ): number[] => {

//     // Check to see if pawns are captured (otherwise there is no point in this process)
//     const hasPawns = player == 1 
//     ? board.CapturesP1.filter(capture => capture.Type === PieceType.Pawn)
//     : board.CapturesP2.filter(capture => capture.Type === PieceType.Pawn);

//     // All possible files (columns) to be filtered out.
//     let openFiles = [ 1, 2, 3, 4 ,5, 6, 7, 8, 9 ];

//     // Filter out files that already contain a player's unpromoted pawn.
//     if(hasPawns.length > 0){
//       board.Squares.forEach(s => {
//         if( s.Piece.Type == PieceType.Pawn ){
//           if( s.Piece.Player == player) { 
//             // console.log(`openFilesP1...filter BEFORE ${s.X}`);
//             // console.dir(openFilesP1);
//             openFiles = openFiles.filter(x => x != s.X); 
//             // console.log(`openFilesP1...filter AFTER ${s.X}`);
//             // console.dir(openFilesP1);
//           }
//         }
//       });
//     }    
//     return openFiles;
//   };


//   evaluateVector = ( 
//     piece: PieceModel, board: BoardModel, targetX: number, targetY: number, isBlocked: Boolean, isLogSubject: boolean = false
//   ): TargetSquare =>{

//     // Check board dimensions.
//     if(targetX >= 1 && targetX <= 9 && targetY >= 1 && targetY <= 9){
          
//       // Find the target square.
//       const s = board.Squares.find( s => s.X == targetX && s.Y == targetY );
//       if(s == undefined) return new TargetSquare(11, 11, TargetStatus.Na );

//       switch (s?.Piece.Player) {
        
//         case 0: // Open squares
//           if(isBlocked){
//             // if(isLogSubject){console.log(`\t${targetX}${targetY}: ${TargetStatus.Blocked} (isBlocked)`);}            
//             const result = new TargetSquare(s.X, s.Y, TargetStatus.Blocked );
//             return result;
            
//           } else {
//             // if(isLogSubject){console.log(`\t${targetX}${targetY}: ${TargetStatus.Open} (!isBlocked)`);}
//             const result = new TargetSquare(s.X, s.Y, TargetStatus.Open );
//             return result;
//           }

//         case piece.Player:
//           if(isLogSubject){console.log(`\tpiece.Player: ${piece.Player}`);}
//           if(isLogSubject){console.log(`\t${targetX}${targetY}: ${TargetStatus.Ally} (${s.Piece.Id})`);}
//           return new TargetSquare(s.X, s.Y, TargetStatus.Ally );
      
//         default: // Enemy

//           if(isBlocked){
//             if(isLogSubject){console.log(`\t${targetX}${targetY}: ${TargetStatus.Blocked} (isBlocked enemy)`);}
//             const result = new TargetSquare(s.X, s.Y, TargetStatus.Blocked );
//             return result;
            
//           } else {
            
//             // const isCheck = s.Piece.Type == PieceType.KingChallenger || PieceType.KingVictor;
//             const isCheck = s.Piece.Type == PieceType.King;
//             if( isCheck ){              
//               if(isLogSubject){console.log(`\t${targetX}${targetY}: ${TargetStatus.Check} (!isBlocked enemy && isCheck)`);}
//               const result = new TargetSquare(s.X, s.Y, TargetStatus.Check );
//               return result;
//             }
//             if(isLogSubject){console.log(`\t${targetX}${targetY}: ${TargetStatus.Enemy} (!isBlocked enemy && !isCheck)`);}
//             const result = new TargetSquare(s.X, s.Y, TargetStatus.Enemy );  
//             return result;

//           }




//       }

//     };
//     return new TargetSquare(10, 10, TargetStatus.OutOfRange );
//   }

  

  

//   //===================================================================================================================
 
//   detectCheckCondition (squares: GameSquareModel[]): GameSquareModel[] {
//     if(this.logPhase) console.log("\r\ndetectCheckCondition... ");

//     let checks = [] as GameSquareModel[];

//     squares.forEach(s => {
//       if(s.Piece.Player != 0){
//         var inCheck = s.Piece.MovementMap.some(p => p.Status == TargetStatus.Check);
//         if(inCheck){

//           checks.push(
//             new GameSquareModel(
//               s.X, 
//               s.Y, 
//               s.PromotionZoneFor,
//               new PieceModel(
//                 s.Piece.Player,
//                 s.Piece.Type,
//                 s.Piece.StartingPosition,
//                 s.Piece.Icon,
//                 s.Piece.IsFacingDefault,
//                 s.Piece.MovementMap
//               )
//             ));

//           console.error(`inCheck from ${s.Id}'s ${s.Piece.Id} (${s.X}, ${s.Y})`);
//         }
//       }
//     });

//     return checks;
//   }

  
//   HandleChecks = ( board: BoardModel ): BoardModel =>{
//     if(this.logPhase) console.log(`\r\nHandleChecks ... `);
    
//     if(board.Checks.length == 0){ 
//       return board;
//     }

//     const defender = board.Checks[0]?.Piece?.Player;
//     if(defender != 0){
//       const target = board.Squares.filter(s => 
//         s.Piece.Player == defender 
//         && s.Piece.Type == PieceType.King
//       )[0];

      

//     }

//     board.Checks.forEach( attackVector => {
//       target.Piece.MovementMap.filter( escapeVector => {
//         escapeVector.Id != attackVector.Id
//       });
      
//     });

//     return board;
//   };


// }
