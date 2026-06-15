export type Tournament = {
  id: string
  name: string
  type: string
  country: string | null
  logoUrl: string | null
}

export type Season = {
  id: string
  tournamentId: string
  name: string
  startDate: string
  endDate: string
  status: string
}

export type Team = {
  id: string
  name: string
  shortName: string | null
}

export type Player = {
  id: string
  name: string
  position: string
  nationality: string | null
  currentTeamId: string | null
}

export type Match = {
  id: string
  seasonId: string
  homeTeamId: string
  awayTeamId: string
  matchDate: string
  status: string
  homeScore: number | null
  awayScore: number | null
  venue: string | null
  stage: string | null
  homeTeam?: Team
  awayTeam?: Team
}

export type PlayerMatchStat = {
  id: string
  matchId: string
  playerId: string
  teamId: string
  minutesPlayed: number
  match?: Match
}