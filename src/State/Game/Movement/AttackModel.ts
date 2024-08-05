import { GameSquareModel } from "../Squares/GameSquareModel";
import { TargetSquareModel } from "../Squares/TargetSquareModel";
import { VectorName } from "./VectorName";

export class AttackModel {
  Attacker: GameSquareModel;
  AttackVector: VectorName = VectorName.None;
  Checked: TargetSquareModel | null;
  Defender: TargetSquareModel | null;

  get IsCheck(): boolean {
    return this.Defender == null;
  }
  get IsPin(): boolean {    
    return this.Defender != null;
  }
  
  constructor(attacker: GameSquareModel) {
    this.Attacker = attacker;
    this.Checked = null;
    this.Defender = null;
  }
}