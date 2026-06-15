export enum PlayerPosition {
  GK = 'GK',
  CB = 'CB',
  LB = 'LB',
  RB = 'RB',
  CDM = 'CDM',
  CM = 'CM',
  CAM = 'CAM',
  LW = 'LW',
  RW = 'RW',
  ST = 'ST',
}

export enum MatchEventType {
  PASS = 'pass',
  SHOT = 'shot',
  DRIBBLE = 'dribble',
  TACKLE = 'tackle',
  INTERCEPTION = 'interception',
  GOAL = 'goal',
  CLEARANCE = 'clearance',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  FINISHED = 'finished',
  POSTPONED = 'postponed',
  CANCELLED = 'cancelled',
}

export enum SeasonStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
}

export enum EventOutcome {
  SUCCESS = 'success',
  FAIL = 'fail',
}

export enum MatchPeriod {
  FIRST_HALF = '1H',
  SECOND_HALF = '2H',
}

export enum TournamentType {
  CUP = 'cup',
  LEAGUE = 'league',
}