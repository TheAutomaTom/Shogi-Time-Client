import { SquareModel } from "./SquareModel";


export type BoardModel = {
  Id: string;
  CurrentPlayer: number;
  Squares: Array<SquareModel>;

};
