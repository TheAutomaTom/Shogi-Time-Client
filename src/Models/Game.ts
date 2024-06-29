export type GameBoardModel = {
  Id: string;
  Squares: Array<GameSquareModel>;
  
};

export type GameSquareModel = {
  id: string;
  x: number;
  y: number;
  Piece?: GamePieceModel;
  IsFocus: boolean;
  
};

export type GamePieceModel = {
  id: string;
  player: number;
  name: string;
  img: string;
  IsFocus: boolean;

}

