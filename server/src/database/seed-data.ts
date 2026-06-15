import { PlayerPosition } from '../common/enums';

export const TOURNAMENT_NAME = 'FIFA World Cup 2026';

export const HOST_VENUES = [
  'MetLife Stadium, New York/New Jersey',
  'SoFi Stadium, Los Angeles',
  'AT&T Stadium, Dallas',
  'Mercedes-Benz Stadium, Atlanta',
  'Hard Rock Stadium, Miami',
  'Lincoln Financial Field, Philadelphia',
  'Gillette Stadium, Boston',
  'Arrowhead Stadium, Kansas City',
  'NRG Stadium, Houston',
  'Lumen Field, Seattle',
  'Levi\'s Stadium, San Francisco Bay Area',
  'BC Place, Vancouver',
  'BMO Field, Toronto',
  'Estadio Azteca, Mexico City',
  'Estadio Akron, Guadalajara',
  'Estadio BBVA, Monterrey',
] as const;

export interface SeedTeam {
  name: string;
  shortName: string;
  country: string;
  confederation: string;
  groupId: number;
}

export interface SeedPlayerTemplate {
  name: string;
  position: PlayerPosition;
  nationality: string;
  birthDate: string;
  heightCm: number;
  weightKg: number;
  preferredFoot: 'left' | 'right' | 'both';
  isStar?: boolean;
}

export const GROUPS: SeedTeam[][] = [
  [
    { name: 'Mexico', shortName: 'MEX', country: 'Mexico', confederation: 'CONCACAF', groupId: 1 },
    { name: 'South Africa', shortName: 'RSA', country: 'South Africa', confederation: 'CAF', groupId: 1 },
    { name: 'South Korea', shortName: 'KOR', country: 'South Korea', confederation: 'AFC', groupId: 1 },
    { name: 'Denmark', shortName: 'DEN', country: 'Denmark', confederation: 'UEFA', groupId: 1 },
  ],
  [
    { name: 'Canada', shortName: 'CAN', country: 'Canada', confederation: 'CONCACAF', groupId: 2 },
    { name: 'Italy', shortName: 'ITA', country: 'Italy', confederation: 'UEFA', groupId: 2 },
    { name: 'Qatar', shortName: 'QAT', country: 'Qatar', confederation: 'AFC', groupId: 2 },
    { name: 'Switzerland', shortName: 'SUI', country: 'Switzerland', confederation: 'UEFA', groupId: 2 },
  ],
  [
    { name: 'Brazil', shortName: 'BRA', country: 'Brazil', confederation: 'CONMEBOL', groupId: 3 },
    { name: 'Morocco', shortName: 'MAR', country: 'Morocco', confederation: 'CAF', groupId: 3 },
    { name: 'Haiti', shortName: 'HAI', country: 'Haiti', confederation: 'CONCACAF', groupId: 3 },
    { name: 'Scotland', shortName: 'SCO', country: 'Scotland', confederation: 'UEFA', groupId: 3 },
  ],
  [
    { name: 'United States', shortName: 'USA', country: 'United States', confederation: 'CONCACAF', groupId: 4 },
    { name: 'Paraguay', shortName: 'PAR', country: 'Paraguay', confederation: 'CONMEBOL', groupId: 4 },
    { name: 'Australia', shortName: 'AUS', country: 'Australia', confederation: 'AFC', groupId: 4 },
    { name: 'Turkey', shortName: 'TUR', country: 'Turkey', confederation: 'UEFA', groupId: 4 },
  ],
  [
    { name: 'Germany', shortName: 'GER', country: 'Germany', confederation: 'UEFA', groupId: 5 },
    { name: 'Curaçao', shortName: 'CUW', country: 'Curaçao', confederation: 'CONCACAF', groupId: 5 },
    { name: 'Ivory Coast', shortName: 'CIV', country: 'Ivory Coast', confederation: 'CAF', groupId: 5 },
    { name: 'Ecuador', shortName: 'ECU', country: 'Ecuador', confederation: 'CONMEBOL', groupId: 5 },
  ],
  [
    { name: 'Netherlands', shortName: 'NED', country: 'Netherlands', confederation: 'UEFA', groupId: 6 },
    { name: 'Japan', shortName: 'JPN', country: 'Japan', confederation: 'AFC', groupId: 6 },
    { name: 'Ukraine', shortName: 'UKR', country: 'Ukraine', confederation: 'UEFA', groupId: 6 },
    { name: 'Tunisia', shortName: 'TUN', country: 'Tunisia', confederation: 'CAF', groupId: 6 },
  ],
  [
    { name: 'Belgium', shortName: 'BEL', country: 'Belgium', confederation: 'UEFA', groupId: 7 },
    { name: 'Egypt', shortName: 'EGY', country: 'Egypt', confederation: 'CAF', groupId: 7 },
    { name: 'Iran', shortName: 'IRN', country: 'Iran', confederation: 'AFC', groupId: 7 },
    { name: 'New Zealand', shortName: 'NZL', country: 'New Zealand', confederation: 'OFC', groupId: 7 },
  ],
  [
    { name: 'Spain', shortName: 'ESP', country: 'Spain', confederation: 'UEFA', groupId: 8 },
    { name: 'Cape Verde', shortName: 'CPV', country: 'Cape Verde', confederation: 'CAF', groupId: 8 },
    { name: 'Saudi Arabia', shortName: 'KSA', country: 'Saudi Arabia', confederation: 'AFC', groupId: 8 },
    { name: 'Uruguay', shortName: 'URU', country: 'Uruguay', confederation: 'CONMEBOL', groupId: 8 },
  ],
  [
    { name: 'France', shortName: 'FRA', country: 'France', confederation: 'UEFA', groupId: 9 },
    { name: 'Senegal', shortName: 'SEN', country: 'Senegal', confederation: 'CAF', groupId: 9 },
    { name: 'Norway', shortName: 'NOR', country: 'Norway', confederation: 'UEFA', groupId: 9 },
    { name: 'Iraq', shortName: 'IRQ', country: 'Iraq', confederation: 'AFC', groupId: 9 },
  ],
  [
    { name: 'Argentina', shortName: 'ARG', country: 'Argentina', confederation: 'CONMEBOL', groupId: 10 },
    { name: 'Algeria', shortName: 'ALG', country: 'Algeria', confederation: 'CAF', groupId: 10 },
    { name: 'Austria', shortName: 'AUT', country: 'Austria', confederation: 'UEFA', groupId: 10 },
    { name: 'Jordan', shortName: 'JOR', country: 'Jordan', confederation: 'AFC', groupId: 10 },
  ],
  [
    { name: 'Portugal', shortName: 'POR', country: 'Portugal', confederation: 'UEFA', groupId: 11 },
    { name: 'Uzbekistan', shortName: 'UZB', country: 'Uzbekistan', confederation: 'AFC', groupId: 11 },
    { name: 'Colombia', shortName: 'COL', country: 'Colombia', confederation: 'CONMEBOL', groupId: 11 },
    { name: 'DR Congo', shortName: 'COD', country: 'DR Congo', confederation: 'CAF', groupId: 11 },
  ],
  [
    { name: 'England', shortName: 'ENG', country: 'England', confederation: 'UEFA', groupId: 12 },
    { name: 'Croatia', shortName: 'CRO', country: 'Croatia', confederation: 'UEFA', groupId: 12 },
    { name: 'Ghana', shortName: 'GHA', country: 'Ghana', confederation: 'CAF', groupId: 12 },
    { name: 'Panama', shortName: 'PAN', country: 'Panama', confederation: 'CONCACAF', groupId: 12 },
  ],
];

export const STAR_PLAYERS: Record<string, SeedPlayerTemplate[]> = {
  Argentina: [
    { name: 'Lionel Messi', position: PlayerPosition.RW, nationality: 'Argentina', birthDate: '1987-06-24', heightCm: 170, weightKg: 72, preferredFoot: 'left', isStar: true },
    { name: 'Emiliano Martínez', position: PlayerPosition.GK, nationality: 'Argentina', birthDate: '1992-09-02', heightCm: 195, weightKg: 88, preferredFoot: 'right' },
    { name: 'Cristian Romero', position: PlayerPosition.CB, nationality: 'Argentina', birthDate: '1998-04-27', heightCm: 185, weightKg: 79, preferredFoot: 'right' },
    { name: 'Rodrigo De Paul', position: PlayerPosition.CM, nationality: 'Argentina', birthDate: '1994-05-24', heightCm: 180, weightKg: 70, preferredFoot: 'right' },
    { name: 'Lautaro Martínez', position: PlayerPosition.ST, nationality: 'Argentina', birthDate: '1997-08-22', heightCm: 174, weightKg: 72, preferredFoot: 'right' },
  ],
  France: [
    { name: 'Kylian Mbappé', position: PlayerPosition.ST, nationality: 'France', birthDate: '1998-12-20', heightCm: 178, weightKg: 73, preferredFoot: 'right', isStar: true },
    { name: 'Mike Maignan', position: PlayerPosition.GK, nationality: 'France', birthDate: '1995-07-03', heightCm: 191, weightKg: 89, preferredFoot: 'right' },
    { name: 'William Saliba', position: PlayerPosition.CB, nationality: 'France', birthDate: '2001-03-24', heightCm: 192, weightKg: 83, preferredFoot: 'right' },
    { name: 'Aurélien Tchouaméni', position: PlayerPosition.CDM, nationality: 'France', birthDate: '2000-01-27', heightCm: 187, weightKg: 81, preferredFoot: 'right' },
    { name: 'Ousmane Dembélé', position: PlayerPosition.RW, nationality: 'France', birthDate: '1997-05-15', heightCm: 178, weightKg: 67, preferredFoot: 'right' },
  ],
  Brazil: [
    { name: 'Vinícius Júnior', position: PlayerPosition.LW, nationality: 'Brazil', birthDate: '2000-07-12', heightCm: 176, weightKg: 73, preferredFoot: 'right', isStar: true },
    { name: 'Alisson', position: PlayerPosition.GK, nationality: 'Brazil', birthDate: '1992-10-02', heightCm: 193, weightKg: 91, preferredFoot: 'right' },
    { name: 'Marquinhos', position: PlayerPosition.CB, nationality: 'Brazil', birthDate: '1994-05-14', heightCm: 183, weightKg: 75, preferredFoot: 'right' },
    { name: 'Casemiro', position: PlayerPosition.CDM, nationality: 'Brazil', birthDate: '1992-02-23', heightCm: 185, weightKg: 84, preferredFoot: 'right' },
    { name: 'Richarlison', position: PlayerPosition.ST, nationality: 'Brazil', birthDate: '1997-05-10', heightCm: 184, weightKg: 83, preferredFoot: 'right' },
  ],
  England: [
    { name: 'Harry Kane', position: PlayerPosition.ST, nationality: 'England', birthDate: '1993-07-28', heightCm: 188, weightKg: 86, preferredFoot: 'right', isStar: true },
    { name: 'Jordan Pickford', position: PlayerPosition.GK, nationality: 'England', birthDate: '1994-03-07', heightCm: 185, weightKg: 82, preferredFoot: 'left' },
    { name: 'John Stones', position: PlayerPosition.CB, nationality: 'England', birthDate: '1994-05-28', heightCm: 188, weightKg: 70, preferredFoot: 'right' },
    { name: 'Declan Rice', position: PlayerPosition.CDM, nationality: 'England', birthDate: '1999-01-14', heightCm: 185, weightKg: 80, preferredFoot: 'right' },
    { name: 'Bukayo Saka', position: PlayerPosition.RW, nationality: 'England', birthDate: '2001-09-05', heightCm: 178, weightKg: 72, preferredFoot: 'left' },
  ],
  Germany: [
    { name: 'Jamal Musiala', position: PlayerPosition.CAM, nationality: 'Germany', birthDate: '2003-02-26', heightCm: 184, weightKg: 72, preferredFoot: 'right', isStar: true },
    { name: 'Manuel Neuer', position: PlayerPosition.GK, nationality: 'Germany', birthDate: '1986-03-27', heightCm: 193, weightKg: 92, preferredFoot: 'right' },
    { name: 'Antonio Rüdiger', position: PlayerPosition.CB, nationality: 'Germany', birthDate: '1993-03-03', heightCm: 190, weightKg: 85, preferredFoot: 'right' },
    { name: 'Joshua Kimmich', position: PlayerPosition.CDM, nationality: 'Germany', birthDate: '1995-02-08', heightCm: 176, weightKg: 75, preferredFoot: 'right' },
    { name: 'Florian Wirtz', position: PlayerPosition.CAM, nationality: 'Germany', birthDate: '2003-05-03', heightCm: 177, weightKg: 71, preferredFoot: 'right' },
  ],
  Spain: [
    { name: 'Pedri', position: PlayerPosition.CM, nationality: 'Spain', birthDate: '2002-11-25', heightCm: 174, weightKg: 60, preferredFoot: 'right', isStar: true },
    { name: 'Unai Simón', position: PlayerPosition.GK, nationality: 'Spain', birthDate: '1997-06-11', heightCm: 190, weightKg: 84, preferredFoot: 'right' },
    { name: 'Aymeric Laporte', position: PlayerPosition.CB, nationality: 'Spain', birthDate: '1994-05-27', heightCm: 191, weightKg: 85, preferredFoot: 'left' },
    { name: 'Rodri', position: PlayerPosition.CDM, nationality: 'Spain', birthDate: '1996-06-22', heightCm: 191, weightKg: 82, preferredFoot: 'right' },
    { name: 'Lamine Yamal', position: PlayerPosition.RW, nationality: 'Spain', birthDate: '2007-07-13', heightCm: 180, weightKg: 72, preferredFoot: 'left' },
  ],
  'United States': [
    { name: 'Christian Pulisic', position: PlayerPosition.RW, nationality: 'United States', birthDate: '1998-09-18', heightCm: 177, weightKg: 73, preferredFoot: 'right', isStar: true },
    { name: 'Matt Turner', position: PlayerPosition.GK, nationality: 'United States', birthDate: '1994-06-24', heightCm: 190, weightKg: 84, preferredFoot: 'right' },
    { name: 'Tyler Adams', position: PlayerPosition.CDM, nationality: 'United States', birthDate: '1999-02-14', heightCm: 175, weightKg: 72, preferredFoot: 'right' },
    { name: 'Weston McKennie', position: PlayerPosition.CM, nationality: 'United States', birthDate: '1998-08-28', heightCm: 185, weightKg: 78, preferredFoot: 'right' },
    { name: 'Giovanni Reyna', position: PlayerPosition.CAM, nationality: 'United States', birthDate: '2002-11-13', heightCm: 185, weightKg: 79, preferredFoot: 'right' },
  ],
  Mexico: [
    { name: 'Hirving Lozano', position: PlayerPosition.LW, nationality: 'Mexico', birthDate: '1995-07-30', heightCm: 175, weightKg: 70, preferredFoot: 'right', isStar: true },
    { name: 'Guillermo Ochoa', position: PlayerPosition.GK, nationality: 'Mexico', birthDate: '1985-07-13', heightCm: 185, weightKg: 78, preferredFoot: 'right' },
    { name: 'Edson Álvarez', position: PlayerPosition.CDM, nationality: 'Mexico', birthDate: '1997-10-24', heightCm: 185, weightKg: 73, preferredFoot: 'right' },
    { name: 'Luis Chávez', position: PlayerPosition.CM, nationality: 'Mexico', birthDate: '1996-05-15', heightCm: 178, weightKg: 74, preferredFoot: 'left' },
    { name: 'Santiago Giménez', position: PlayerPosition.ST, nationality: 'Mexico', birthDate: '2001-04-18', heightCm: 182, weightKg: 77, preferredFoot: 'right' },
  ],
};

const POSITION_POOL: PlayerPosition[] = [
  PlayerPosition.GK,
  PlayerPosition.CB,
  PlayerPosition.CB,
  PlayerPosition.LB,
  PlayerPosition.RB,
  PlayerPosition.CDM,
  PlayerPosition.CM,
  PlayerPosition.CAM,
  PlayerPosition.LW,
  PlayerPosition.RW,
  PlayerPosition.ST,
];

const FIRST_NAMES = [
  'James', 'Lucas', 'Diego', 'Marco', 'André', 'Youssef', 'Kwame', 'Takeshi',
  'Carlos', 'Pierre', 'Ivan', 'Noah', 'Mateo', 'Sven', 'Amir', 'Felipe',
];

const LAST_NAMES = [
  'Silva', 'García', 'Müller', 'Johnson', 'Santos', 'Rossi', 'Kim', 'Patel',
  'Dubois', 'Hansen', 'Costa', 'Nielsen', 'Okafor', 'Fernández', 'Bakker', 'Ali',
];

export function buildDefaultPlayers(team: SeedTeam): SeedPlayerTemplate[] {
  const stars = STAR_PLAYERS[team.name];
  if (stars) {
    return stars;
  }

  return POSITION_POOL.slice(0, 5).map((position, index) => ({
    name: `${FIRST_NAMES[(team.groupId + index) % FIRST_NAMES.length]} ${LAST_NAMES[(team.groupId * 2 + index) % LAST_NAMES.length]}`,
    position,
    nationality: team.country,
    birthDate: `199${index + 5}-0${index + 1}-15`,
    heightCm: 175 + index * 2,
    weightKg: 70 + index * 2,
    preferredFoot: index % 2 === 0 ? 'right' : 'left',
    isStar: index === 4,
  }));
}

export interface SeedMatchFixture {
  homeShortName: string;
  awayShortName: string;
  matchDate: string;
  venue: string;
  stage: string;
  groupNumber: number;
  homeScore: number;
  awayScore: number;
}

export const MATCH_FIXTURES: SeedMatchFixture[] = [
  { homeShortName: 'MEX', awayShortName: 'RSA', matchDate: '2026-06-11T19:00:00Z', venue: HOST_VENUES[13], stage: 'group', groupNumber: 1, homeScore: 2, awayScore: 1 },
  { homeShortName: 'KOR', awayShortName: 'DEN', matchDate: '2026-06-12T16:00:00Z', venue: HOST_VENUES[0], stage: 'group', groupNumber: 1, homeScore: 1, awayScore: 1 },
  { homeShortName: 'CAN', awayShortName: 'ITA', matchDate: '2026-06-12T22:00:00Z', venue: HOST_VENUES[12], stage: 'group', groupNumber: 2, homeScore: 0, awayScore: 2 },
  { homeShortName: 'BRA', awayShortName: 'MAR', matchDate: '2026-06-13T19:00:00Z', venue: HOST_VENUES[1], stage: 'group', groupNumber: 3, homeScore: 3, awayScore: 0 },
  { homeShortName: 'USA', awayShortName: 'PAR', matchDate: '2026-06-14T22:00:00Z', venue: HOST_VENUES[1], stage: 'group', groupNumber: 4, homeScore: 2, awayScore: 0 },
  { homeShortName: 'GER', awayShortName: 'CIV', matchDate: '2026-06-15T16:00:00Z', venue: HOST_VENUES[2], stage: 'group', groupNumber: 5, homeScore: 2, awayScore: 2 },
  { homeShortName: 'NED', awayShortName: 'JPN', matchDate: '2026-06-15T22:00:00Z', venue: HOST_VENUES[3], stage: 'group', groupNumber: 6, homeScore: 1, awayScore: 0 },
  { homeShortName: 'ESP', awayShortName: 'URU', matchDate: '2026-06-16T19:00:00Z', venue: HOST_VENUES[4], stage: 'group', groupNumber: 8, homeScore: 1, awayScore: 1 },
  { homeShortName: 'FRA', awayShortName: 'SEN', matchDate: '2026-06-17T16:00:00Z', venue: HOST_VENUES[5], stage: 'group', groupNumber: 9, homeScore: 3, awayScore: 1 },
  { homeShortName: 'ARG', awayShortName: 'ALG', matchDate: '2026-06-17T22:00:00Z', venue: HOST_VENUES[13], stage: 'group', groupNumber: 10, homeScore: 2, awayScore: 0 },
  { homeShortName: 'POR', awayShortName: 'COL', matchDate: '2026-06-18T19:00:00Z', venue: HOST_VENUES[6], stage: 'group', groupNumber: 11, homeScore: 1, awayScore: 2 },
  { homeShortName: 'ENG', awayShortName: 'CRO', matchDate: '2026-06-19T16:00:00Z', venue: HOST_VENUES[0], stage: 'group', groupNumber: 12, homeScore: 2, awayScore: 1 },
  { homeShortName: 'ARG', awayShortName: 'AUT', matchDate: '2026-06-24T22:00:00Z', venue: HOST_VENUES[7], stage: 'group', groupNumber: 10, homeScore: 1, awayScore: 0 },
  { homeShortName: 'BRA', awayShortName: 'SCO', matchDate: '2026-06-25T19:00:00Z', venue: HOST_VENUES[8], stage: 'group', groupNumber: 3, homeScore: 4, awayScore: 1 },
  { homeShortName: 'FRA', awayShortName: 'NOR', matchDate: '2026-07-02T22:00:00Z', venue: HOST_VENUES[0], stage: 'round_of_16', groupNumber: 0, homeScore: 2, awayScore: 1 },
  { homeShortName: 'ARG', awayShortName: 'MEX', matchDate: '2026-07-03T22:00:00Z', venue: HOST_VENUES[13], stage: 'round_of_16', groupNumber: 0, homeScore: 3, awayScore: 1 },
  { homeShortName: 'ESP', awayShortName: 'GER', matchDate: '2026-07-08T22:00:00Z', venue: HOST_VENUES[1], stage: 'quarter_final', groupNumber: 0, homeScore: 2, awayScore: 2 },
  { homeShortName: 'ARG', awayShortName: 'FRA', matchDate: '2026-07-14T22:00:00Z', venue: HOST_VENUES[0], stage: 'semi_final', groupNumber: 0, homeScore: 2, awayScore: 1 },
];