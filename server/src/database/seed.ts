import 'reflect-metadata';
import { Repository } from 'typeorm';
import { AuditLog } from '../audit/audit-log.entity';
import { AuditService } from '../audit/audit.service';
import { AuditSubscriber } from '../audit/audit.subscriber';
import { BaseEntitySubscriber } from '../common/subscribers/base-entity.subscriber';
import { auditContextStorage } from '../common/audit-context.storage';
import {
  MatchStatus,
  SeasonStatus,
  TournamentType,
} from '../common/enums';
import { MatchEvent } from '../modules/match-event/match-event.entity';
import { Match } from '../modules/match/match.entity';
import { PlayerMatchStat } from '../modules/player-match-stat/player-match-stat.entity';
import { Player } from '../modules/player/player.entity';
import { Season } from '../modules/season/season.entity';
import { Team } from '../modules/team/team.entity';
import { Tournament } from '../modules/tournament/tournament.entity';
import dataSource from './data-source';
import { seedRbac } from './seed-rbac';
import {
  GROUPS,
  MATCH_FIXTURES,
  TOURNAMENT_NAME,
  buildDefaultPlayers,
} from './seed-data';
import {
  GeneratedMatchEvent,
  SEED_METADATA,
  bulkAuditCreate,
  generatePlayerEvents,
  generatePlayerMatchStat,
  randomInt,
} from './seed.helpers';

const INSERT_CHUNK_SIZE = 500;

async function insertInChunks<T extends object>(
  repo: Repository<T>,
  entities: T[],
  chunkSize = INSERT_CHUNK_SIZE,
): Promise<Array<T & { id: string }>> {
  const saved: Array<T & { id: string }> = [];

  for (let i = 0; i < entities.length; i += chunkSize) {
    const chunk = entities.slice(i, i + chunkSize);
    const result = await repo
      .createQueryBuilder()
      .insert()
      .values(chunk)
      .returning('*')
      .execute();

    const rows = (result.raw as Array<T & { id: string }>) ?? [];
    saved.push(...rows);
  }

  return saved;
}

async function clearExistingSeedData(
  tournamentRepo: Repository<Tournament>,
): Promise<void> {
  const existing = await tournamentRepo.findOne({
    where: { name: TOURNAMENT_NAME },
  });

  if (!existing) {
    return;
  }

  console.log('Clearing existing FIFA World Cup 2026 seed data...');
  await dataSource.query(
    `DELETE FROM audit_logs WHERE metadata->>'requestId' = $1`,
    [SEED_METADATA.requestId],
  );
  await dataSource.query(`
    TRUNCATE TABLE
      match_events,
      player_match_stats,
      matches,
      players,
      teams,
      seasons,
      tournaments
    RESTART IDENTITY CASCADE
  `);
}

function getEventBudget(playerName: string, isStar: boolean): number {
  if (playerName === 'Lionel Messi') {
    return 250;
  }

  if (isStar) {
    return 180;
  }

  return 120;
}

async function seed(): Promise<void> {
  await dataSource.initialize();

  const auditRepo = dataSource.getRepository(AuditLog);
  const auditService = new AuditService(auditRepo);
  new AuditSubscriber(dataSource, auditService);
  new BaseEntitySubscriber(dataSource);

  const tournamentRepo = dataSource.getRepository(Tournament);
  const seasonRepo = dataSource.getRepository(Season);
  const teamRepo = dataSource.getRepository(Team);
  const playerRepo = dataSource.getRepository(Player);
  const matchRepo = dataSource.getRepository(Match);
  const matchEventRepo = dataSource.getRepository(MatchEvent);
  const playerMatchStatRepo = dataSource.getRepository(PlayerMatchStat);

  await auditContextStorage.run(
    {
      requestId: SEED_METADATA.requestId,
      userAgent: 'basis-sports-seed-script',
      ip: '127.0.0.1',
    },
    async () => {
      await clearExistingSeedData(tournamentRepo);

      console.log('Creating tournament and season...');
      const tournament = await tournamentRepo.save(
        tournamentRepo.create({
          name: TOURNAMENT_NAME,
          type: TournamentType.CUP,
          country: 'International',
          metadata: {
            hosts: ['United States', 'Canada', 'Mexico'],
            teams: 48,
            groups: 12,
          },
        }),
      );

      const season = await seasonRepo.save(
        seasonRepo.create({
          tournamentId: tournament.id,
          name: '2026',
          startDate: '2026-06-11',
          endDate: '2026-07-19',
          status: SeasonStatus.ONGOING,
        }),
      );

      console.log('Creating 48 teams...');
      const teams: Team[] = [];
      for (const group of GROUPS) {
        for (const teamData of group) {
          teams.push(
            await teamRepo.save(
              teamRepo.create({
                name: teamData.name,
                shortName: teamData.shortName,
                country: teamData.country,
                confederation: teamData.confederation,
                groupId: teamData.groupId,
              }),
            ),
          );
        }
      }

      const teamMap = Object.fromEntries(
        teams.map((team) => [team.shortName, team]),
      );

      console.log('Creating players (5 per team)...');
      const players: Player[] = [];
      const playersByTeam = new Map<string, Player[]>();
      const playerStarMap = new Map<string, boolean>();

      for (const team of teams) {
        const teamData = GROUPS.flat().find((t) => t.shortName === team.shortName)!;
        const templates = buildDefaultPlayers(teamData);
        const teamPlayers: Player[] = [];

        for (const template of templates) {
          const player = await playerRepo.save(
            playerRepo.create({
              name: template.name,
              position: template.position,
              nationality: template.nationality,
              birthDate: template.birthDate,
              heightCm: template.heightCm,
              weightKg: template.weightKg,
              preferredFoot: template.preferredFoot,
              currentTeamId: team.id,
            }),
          );
          players.push(player);
          teamPlayers.push(player);
          playerStarMap.set(player.id, template.isStar ?? false);
        }

        playersByTeam.set(team.id, teamPlayers);
      }

      console.log(`Creating ${MATCH_FIXTURES.length} matches...`);
      const matches: Match[] = [];
      for (const fixture of MATCH_FIXTURES) {
        const homeTeam = teamMap[fixture.homeShortName];
        const awayTeam = teamMap[fixture.awayShortName];

        if (!homeTeam || !awayTeam) {
          throw new Error(
            `Unknown team in fixture: ${fixture.homeShortName} vs ${fixture.awayShortName}`,
          );
        }

        matches.push(
          await matchRepo.save(
            matchRepo.create({
              seasonId: season.id,
              homeTeamId: homeTeam.id,
              awayTeamId: awayTeam.id,
              matchDate: new Date(fixture.matchDate),
              status: MatchStatus.FINISHED,
              homeScore: fixture.homeScore,
              awayScore: fixture.awayScore,
              venue: fixture.venue,
              stage: fixture.stage,
              groupNumber: fixture.groupNumber,
            }),
          ),
        );
      }

      console.log('Generating match events and player stats...');
      const pendingEvents: GeneratedMatchEvent[] = [];
      const pendingStats: ReturnType<typeof generatePlayerMatchStat>[] = [];
      const playerEventTotals = new Map<string, number>();

      for (const match of matches) {
        const homeTeam = teams.find((t) => t.id === match.homeTeamId)!;
        const awayTeam = teams.find((t) => t.id === match.awayTeamId)!;

        for (const team of [homeTeam, awayTeam]) {
          const squad = playersByTeam.get(team.id) ?? [];

          for (const player of squad) {
            const existingTotal = playerEventTotals.get(player.id) ?? 0;
            const maxEvents = getEventBudget(
              player.name,
              playerStarMap.get(player.id) ?? false,
            );

            if (existingTotal >= maxEvents) {
              continue;
            }

            const remaining = maxEvents - existingTotal;
            const eventCount = Math.min(randomInt(12, 28), remaining);
            const generated = generatePlayerEvents(
              match.id,
              player.id,
              team.id,
              player.position,
              player.name,
              eventCount,
            );

            playerEventTotals.set(player.id, existingTotal + eventCount);
            pendingEvents.push(...generated);
            pendingStats.push(
              generatePlayerMatchStat(
                match.id,
                player.id,
                team.id,
                player.position,
                generated,
              ),
            );
          }
        }
      }

      console.log(`Inserting ${pendingEvents.length} match events...`);
      const savedEvents = await insertInChunks(matchEventRepo, pendingEvents);

      console.log(`Inserting ${pendingStats.length} player match stats...`);
      const savedStats = await insertInChunks(playerMatchStatRepo, pendingStats);

      console.log('Writing bulk audit logs for match events and stats...');
      await bulkAuditCreate(auditRepo, 'MatchEvent', savedEvents);
      await bulkAuditCreate(auditRepo, 'PlayerMatchStat', savedStats);

      console.log('\nSeed completed successfully!');
      console.log(`  Tournament:  ${tournament.name}`);
      console.log(`  Season:      ${season.name}`);
      console.log(`  Teams:       ${teams.length}`);
      console.log(`  Players:     ${players.length}`);
      console.log(`  Matches:     ${matches.length}`);
      console.log(`  Events:      ${savedEvents.length}`);
      console.log(`  Stats:       ${savedStats.length}`);
      console.log(`  Audit logs:  ${await auditRepo.count()}`);

      await seedRbac(dataSource);
    },
  );

  await dataSource.destroy();
}

seed().catch((error: unknown) => {
  console.error('Seed failed:', error);
  void dataSource.destroy();
  process.exit(1);
});