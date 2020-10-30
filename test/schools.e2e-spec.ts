import * as request from 'supertest';
import { factory } from 'typeorm-seeding';
import { INestApplication } from '@nestjs/common';
import { School } from '../src/schools/school.entity';
import { PatchSchoolDto } from '../src/schools/dto/patch-school.dto';
import { TestHelper } from './test-helper';
import { User } from '../src/users/user.entity';
import { CV } from '../src/cv/cv.entity';
import { Role } from '../src/roles/role.entity';
import { ADMIN_ROLE } from '../src/constants';

describe('SchoolsController (e2e)', () => {
  const testHelper: TestHelper = new TestHelper();
  let app: INestApplication;

  let user: User;
  let admin: User;
  let cv: CV;
  let adminCV: CV;
  let accessToken: string;
  let adminAccessToken: string;

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

    const adminRole = await factory(Role)().create({ name: ADMIN_ROLE });
    admin = await factory(User)().create({ roles: [adminRole] });
    adminCV = await factory(CV)().create({ userId: admin.id });
    admin.cv = adminCV;
    admin.templates = [];

    accessToken = testHelper.sign(user);
    adminAccessToken = testHelper.sign(admin);
  });

  afterAll(async (done) => {
    await testHelper.resetDb();
    await testHelper.close();
    done();
  });

  describe('/schools (GET)', () => {
    it('successfully retrieves all schools', async () => {
      const school = await factory(School)().create();
      const response = await request(app.getHttpServer())
        .get('/schools')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual([
        {
          ...school,
          createdAt: school.createdAt.toJSON(),
          updatedAt: school.updatedAt.toJSON(),
        },
      ]);
    });

    it('responds with 401 when not authenticated', async () => {
      await request(app.getHttpServer()).get('/schools').expect(401);
    });
  });

  describe('/schools/:id (GET)', () => {
    it('successfully responds requested school', async () => {
      const school = await factory(School)().create();
      const response = await request(app.getHttpServer())
        .get(`/schools/${school.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual({
        ...school,
        createdAt: school.createdAt.toJSON(),
        updatedAt: school.updatedAt.toJSON(),
      });
    });

    it('responds status 404 when school is not found', async () => {
      await request(app.getHttpServer())
        .get('/schools/2')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/schools/:id (DELETE)', () => {
    it('deletes school', async () => {
      const school = await factory(School)().create();
      await request(app.getHttpServer())
        .delete(`/schools/${school.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);

      const response = await request(app.getHttpServer())
        .delete(`/schools/${school.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      expect(response.body).toEqual({});
    });

    it('responds status 404 when school is not found', async () => {
      await request(app.getHttpServer())
        .get('/schools/2')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/schools (POST)', () => {
    it('successfully creates new school', async () => {
      const newSchool = await factory(School)().make();

      const response = await request(app.getHttpServer())
        .post('/schools')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newSchool)
        .expect(201);

      expect(response.body).toMatchObject({ ...newSchool, id: 1 });
    });

    it('fails and responds status 400 when name is empty', async () => {
      const newSchool = await factory(School)().make({ name: '' });
      await request(app.getHttpServer())
        .post('/schools')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newSchool)
        .expect(400);
    });
  });

  describe('/schools/:schoolId (PATCH)', () => {
    it('updates school', async () => {
      const school = await factory(School)().create();

      const patchSchoolDto: PatchSchoolDto = {
        name: 'Metropolia',
      };

      await request(app.getHttpServer())
        .patch(`/schools/${school.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchSchoolDto)
        .expect(403);

      const response = await request(app.getHttpServer())
        .patch(`/schools/${school.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(patchSchoolDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: school.id,
        name: patchSchoolDto.name,
      });
    });
  });
});
