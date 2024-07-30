import { GameSquareModel } from "../GameSquareModel"
import { TargetStatus } from "./TargetStatus"

export type VectorTargetReport = {
  Status: TargetStatus
  Square: GameSquareModel | undefined,
}
