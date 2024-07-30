export class BaseSquareModel {
  Id: string;  
  X: number;
  Y: number;

  constructor(x : number, y: number){
    this.Id = `S${x}${y}`;
    this.X = x;
    this.Y = y;
  }
};
