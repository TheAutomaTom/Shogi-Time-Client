export type GameBoardModel = {
  Id: string;
  Squares: Array<GameSquareModel>;
  
};

export type GameSquareModel = {
  x: number;
  y: number;
  Piece?: GamePieceModel;
};

export type GamePieceModel = {
  player: number;
  name: string;
  img: string;

}

