export enum GamePhase {

  LoadingBoard = "loading-board",
  TurnStart = "turn-start",
  
  MoveStart = "move-start",
  MoveAttempt = "move-attempt",
  MoveEnd = "move-end",
  PromoteOption = "promote-option",

  DropStart = "drop-start",
  DropEnd = "drop-end",
  
  CheckCondition = "check-condition",
  GameOver = "game-over"

}
