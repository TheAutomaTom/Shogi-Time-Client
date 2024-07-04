import { Coordinate } from './Coordinate';
import { GamePieceModel } from './GamePieceModel';


export type Obstacle = {
  where: Coordinate;
  what: GamePieceModel;
};
