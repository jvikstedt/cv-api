import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { factory, useSeeding } from 'typeorm-seeding';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { User } from '../src/users/user.entity';
import { CV } from '../src/cv/cv.entity';
import { AppModule } from '../src/app.module';
import { generateAccessToken } from './test-helper';
import { PatchCVDto } from '../src/cv/dto/patch-cv.dto';

describe('CVController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let jwtService: JwtService;

  let user: User;
  let cv: CV;
  let accessToken: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = module.createNestApplication();
    await app.init();

    connection = module.get<Connection>(Connection);
    jwtService = module.get<JwtService>(JwtService);

    await useSeeding();
  });

  beforeEach(async () => {
    await connection.synchronize(true);

    user = await factory(User)().create();
    cv = await factory(CV)().create({ userId: user.id });
    user.cv = cv;
    user.templates = [];

    accessToken = generateAccessToken(jwtService, user);
  });

  afterAll(async (done) => {
    await connection.synchronize(true);
    await app.close();
    done();
  });

  describe('/cv/:cvId (PATCH)', () => {
    it('updates skill', async () => {
      const patchSkillDto: PatchCVDto = {
        description: 'new text',
      };

      const response = await request(app.getHttpServer())
        .patch(`/cv/${cv.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchSkillDto)
        .expect(200)

      expect(response.body).toMatchObject({
        id: cv.id,
        userId: user.id,
        description: patchSkillDto.description,
      });;
    });

    it('responds with forbidden (403) when trying to modify someone elses cv', async () => {
      const patchSkillDto: PatchCVDto = {
        description: 'new text',
      };

      await request(app.getHttpServer())
        .patch(`/cv/10`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchSkillDto)
        .expect(403)
    });
  });


  describe('/cv (GET)', () => {
    it('returns cvs', async () => {
      const response = await request(app.getHttpServer())
        .get(`/cv`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body).toMatchObject([
        {
          ...cv,
          createdAt: cv.createdAt.toJSON(),
          updatedAt: cv.updatedAt.toJSON(),
        }
      ]);
    });
  });

  describe('/cv/:cvId (GET)', () => {
    it('returns cv', async () => {
      const response = await request(app.getHttpServer())
        .get(`/cv/${cv.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body).toMatchObject({
        ...cv,
        createdAt: cv.createdAt.toJSON(),
        updatedAt: cv.updatedAt.toJSON(),
      });

      await request(app.getHttpServer())
        .get('/cv/10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
    });
  });
});
