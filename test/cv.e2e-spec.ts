import * as request from 'supertest';
import { factory } from 'typeorm-seeding';
import { INestApplication } from '@nestjs/common';
import { User } from '../src/users/user.entity';
import { CV } from '../src/cv/cv.entity';
import { TestHelper } from './test-helper';
import { PatchCVDto } from '../src/cv/dto/patch-cv.dto';

describe('CVController (e2e)', () => {
  const testHelper: TestHelper = new TestHelper();
  let app: INestApplication;

  let user: User;
  let cv: CV;
  let accessToken: string;

  beforeAll(async () => {
    await testHelper.setup();
    app = testHelper.app;
  });

  beforeEach(async () => {
    await testHelper.resetDb();

    user = await factory(User)().create();
    cv = await factory(CV)().create({ userId: user.id });
    user.cv = cv;
    user.templates = [];

    accessToken = testHelper.sign(user);
  });

  afterAll(async (done) => {
    await testHelper.resetDb();
    await testHelper.close();
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
