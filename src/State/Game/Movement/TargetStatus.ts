export enum TargetStatus {
  Na = "na",
  OutOfRange = "out-of-range",

  Open = "open",
  Blocked = "blocked",
  Ally = "ally",
  Enemy = "enemy",

  Pinned = "pinned",
  Check = "check",

  // BlockedCheck is used to retroactively scan for pinned pieces.
  BlockedCheck = "blocked-check",

}
