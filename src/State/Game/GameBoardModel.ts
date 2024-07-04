import { GameSquareModel } from "./GameSquareModel";


export type GameBoardModel = {
  Id: string;
  CurrentPlayer: number;
  Squares: Array<GameSquareModel>;

};
