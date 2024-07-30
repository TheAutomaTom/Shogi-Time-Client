import { GameSquareModel } from "../Squares/GameSquareModel";
import { PieceModel } from "../Pieces/PieceModel";
import { PieceType } from "../Pieces/PieceType";
import { TargetSquareModel } from "../Squares/TargetSquareModel";
import { TargetStatus } from "../Squares/TargetStatus";
import { VectorName } from "./VectorName";

export class Vector {

  Name: VectorName;
  Range: number;  
  XIncrement: number;
  YIncrement: number;

  Targets:  TargetSquareModel[];
  
  // Check is tracked in order to tell the King where the attack originates.
  IsCheck: boolean;
  
  // Pins are tracked in order to iterate and set other pieces' PinnedBy property.
  PinnedPiece: PieceModel | null;


  constructor(
    name: VectorName, 
    range: number = 0, x: number = 0, y: number = 0, 
    targets: TargetSquareModel[] = [], isCheck: boolean = false, pinning: PieceModel | null = null
  ) {
    this.Name = name;
    this.Range = range;
    this.XIncrement = x;
    this.YIncrement = y;

    this.Targets = targets;
    this.IsCheck = isCheck;
    this.PinnedPiece = pinning;
    
  }

  Update( status: TargetStatus, target: GameSquareModel ): Vector{
    
    if(status == TargetStatus.Check){
      this.IsCheck = true;
    }
    else if(status == TargetStatus.BlockedCheck){

      // Find piece(s) blocking this check, counting from the square closest to the king in check...
      let piecesBlockingCheck = [] as PieceModel[];

      for (let i = this.Targets.length -1; i < this.Targets.length; i++) {
        if(this.Targets[i].Piece.Type != PieceType.None){
          piecesBlockingCheck.push(this.Targets[i].Piece);
        }
      }
      // If there are multiple pieces between this and the king, it's not really pinned.
      if(piecesBlockingCheck.length == 1 ){
        this.PinnedPiece = piecesBlockingCheck[0];
      }      
    }

    if(target.Piece != undefined){
      this.Targets.push(new TargetSquareModel(target.X, target.Y, status, target.Piece));
    }

    let result = new Vector(
      this.Name,
      this.Range,
      this.XIncrement,
      this.YIncrement,
      this.Targets,
      this.IsCheck,
      this.PinnedPiece
    );

    return result;
  }

}
