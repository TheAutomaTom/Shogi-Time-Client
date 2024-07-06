import { TargetStatus } from "./TargetStatus";

export class TargetSquare {
  Id: string;  
  X: number;
  Y: number;
  Status: TargetStatus;

  constructor(x : number, y: number, condition: TargetStatus) {
    this.Id = `Square-${x}${y}`;
    this.X = x;
    this.Y = y;
    this.Status = condition;
  }
};
