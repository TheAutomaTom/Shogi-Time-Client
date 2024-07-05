import { Coordinate } from "../Movement/Coordinate";
import { MoveStatus } from "../Movement/MoveStatus";

export class PieceMobility {
  Id: Coordinate;
  Status: MoveStatus;

  constructor(x : number, y: number, status: MoveStatus) {
    this.Id = {X:x, Y:y} as Coordinate;
    this.Status = status;
  }
};
