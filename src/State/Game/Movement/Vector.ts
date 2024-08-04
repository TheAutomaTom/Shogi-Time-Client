import { GameSquareModel } from "../Squares/GameSquareModel";
import { TargetSquareModel } from "../Squares/TargetSquareModel";
import { TargetStatus } from "../Squares/TargetStatus";
import { VectorName } from "./VectorName";

export class Vector {

  Name: VectorName;
  Range: number;  
  XIncrement: number;
  YIncrement: number;
  Targets:  TargetSquareModel[];

  constructor(
    name: VectorName, 
    range: number = 0, x: number = 0, y: number = 0, 
    targets: TargetSquareModel[] = []
  ) {
    this.Name = name;
    this.Range = range;
    this.XIncrement = x;
    this.YIncrement = y;

    this.Targets = targets;
    
  }

  Update( status: TargetStatus, target: GameSquareModel, toLog: boolean = false ): Vector{
    
    if(toLog) {console.log(`Vector.Update...`);}

    if(target.Piece != undefined){
      this.Targets.push(new TargetSquareModel(target.X, target.Y, status, target.Piece));
    }

    let result = new Vector(
      this.Name,
      this.Range,
      this.XIncrement,
      this.YIncrement,
      this.Targets
    );

    return result;
  }

}
