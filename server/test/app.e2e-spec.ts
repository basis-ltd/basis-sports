process.env.RBAC_ENFORCE = 'false';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { EmailService } from '../src/modules/auth/email/email.service';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/bootstrap';

describe('API (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let lastResetUrl: string | undefined;
  let testEmail: string;

  const testPassword = 'E2eTestPass123!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue({
        sendPasswordResetEmail: jest.fn(
          async (params: { resetUrl: string }) => {
            lastResetUrl = params.resetUrl;
          },
        ),
        sendWelcomeEmail: jest.fn(async () => undefined),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  beforeEach(async () => {
    testEmail = `e2e-${Date.now()}-${Math.random()}@test.local`;
    lastResetUrl = undefined;

    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        firstName: 'E2E',
        email: testEmail,
        password: testPassword,
      })
      .expect(201);

    accessToken = signupResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  const authHeader = () => ({ Authorization: `Bearer ${accessToken}` });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('database');
        expect(res.body).toHaveProperty('timestamp');
      });
  });

  it('/auth/me (GET)', () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .set(authHeader())
      .expect(200)
      .expect((res) => {
        expect(res.body.user.email).toBe(testEmail);
        expect(res.body.permissions).toContain('players:read');
      });
  });

  it('/tournaments (GET)', () => {
    return request(app.getHttpServer())
      .get('/tournaments')
      .set(authHeader())
      .expect(200);
  });

  it('/matches CRUD round-trip', async () => {
    const seasonsResponse = await request(app.getHttpServer())
      .get('/seasons')
      .set(authHeader())
      .expect(200);
    const teamsResponse = await request(app.getHttpServer())
      .get('/teams')
      .set(authHeader())
      .expect(200);

    const seasonId = seasonsResponse.body[0]?.id;
    const homeTeamId = teamsResponse.body[0]?.id;
    const awayTeamId = teamsResponse.body[1]?.id ?? homeTeamId;

    expect(seasonId).toBeDefined();
    expect(homeTeamId).toBeDefined();

    const createResponse = await request(app.getHttpServer())
      .post('/matches')
      .set(authHeader())
      .send({
        seasonId,
        homeTeamId,
        awayTeamId,
        matchDate: '2026-06-20T18:00:00.000Z',
        venue: 'E2E Test Stadium',
      })
      .expect(201);

    const matchId = createResponse.body.id;
    expect(matchId).toBeDefined();

    await request(app.getHttpServer())
      .get(`/matches/${matchId}`)
      .set(authHeader())
      .expect(200)
      .expect((res) => {
        expect(res.body.venue).toBe('E2E Test Stadium');
      });

    await request(app.getHttpServer())
      .patch(`/matches/${matchId}`)
      .set(authHeader())
      .send({ venue: 'Updated E2E Stadium' })
      .expect(200)
      .expect((res) => {
        expect(res.body.venue).toBe('Updated E2E Stadium');
      });

    await request(app.getHttpServer())
      .delete(`/matches/${matchId}`)
      .set(authHeader())
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({ deleted: true });
      });

    await request(app.getHttpServer())
      .get(`/matches/${matchId}`)
      .set(authHeader())
      .expect(404);
  });

  it('password reset flow', async () => {
    await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email: testEmail })
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toContain('If an account exists');
      });

    expect(lastResetUrl).toBeDefined();
    const token = new URL(lastResetUrl!).searchParams.get('token');
    expect(token).toBeTruthy();

    const newPassword = 'NewE2ePass123!';
    await request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({ token, password: newPassword })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: newPassword })
      .expect(201)
      .expect((res) => {
        expect(res.body.accessToken).toBeDefined();
      });
  });
});