import { TargetStatus } from "./TargetStatus";

export class TargetSquare {
  X: number;
  Y: number;
  Status: TargetStatus;

  constructor(x : number, y: number, condition: TargetStatus) {
    this.X = x;
    this.Y = y;
    this.Status = condition;
  }
};
