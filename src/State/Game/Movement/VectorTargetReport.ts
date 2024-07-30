import { GameSquareModel } from "../Squares/GameSquareModel"
import { TargetStatus } from "../Squares/TargetStatus"

export type VectorTargetReport = {
  Status: TargetStatus
  Square: GameSquareModel | undefined,
}
