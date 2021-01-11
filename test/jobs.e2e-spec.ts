import * as R from 'ramda';
import * as request from 'supertest';
import { factory } from 'typeorm-seeding';
import { INestApplication } from '@nestjs/common';
import { Job, State } from '../src/jobs/job.entity';
import { TestHelper } from './test-helper';
import { User } from '../src/users/user.entity';
import { CV } from '../src/cv/cv.entity';
import { Role } from '../src/roles/role.entity';
import { ADMIN_ROLE } from '../src/constants';
import {CreateJobDto} from 'src/jobs/dto/create-job.dto';

describe('JobsController (e2e)', () => {
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

  describe('/jobs (GET)', () => {
    it('successfully retrieves all jobs', async () => {
      const job = await factory(Job)().create({ userId: user.id });
      const response = await request(app.getHttpServer())
        .get('/jobs')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual([
        {
          ...job,
          createdAt: job.createdAt.toJSON(),
          updatedAt: job.updatedAt.toJSON(),
          user: R.omit(['cv', 'password', 'salt', 'templates'], {
            ...user,
            createdAt: user.createdAt.toJSON(),
            updatedAt: user.updatedAt.toJSON(),
          }),
        },
      ]);
    });

    it('responds with 401 when not authenticated', async () => {
      await request(app.getHttpServer()).get('/jobs').expect(401);
    });
  });

  describe('/jobs/:id (DELETE)', () => {
    it('deletes job', async () => {
      const job = await factory(Job)().create({ userId: user.id });
      const response = await request(app.getHttpServer())
        .delete(`/jobs/${job.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('state', State.Cancelled);
    });

    it('responds status 404 when job is not found', async () => {
      await request(app.getHttpServer())
        .get('/jobs/2')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/jobs/:id/approve (POST)', () => {
    it('approves job', async () => {
      const job = await factory(Job)().create({ userId: user.id });
      const response = await request(app.getHttpServer())
        .post(`/jobs/${job.id}/approve`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('state', State.Approved);
    });

    it('responds status 403 when no admin role', async () => {
      await factory(Job)().create({ userId: user.id });
      await request(app.getHttpServer())
        .get('/jobs/1/approve')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('responds status 404 when job is not found', async () => {
      await request(app.getHttpServer())
        .get('/jobs/2/approve')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/jobs/:id/reject (POST)', () => {
    it('rejects job', async () => {
      const job = await factory(Job)().create({ userId: user.id });
      const response = await request(app.getHttpServer())
        .post(`/jobs/${job.id}/reject`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('state', State.Rejected);
    });

    it('responds status 403 when no admin role', async () => {
      await factory(Job)().create({ userId: user.id });
      await request(app.getHttpServer())
        .get('/jobs/1/reject')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('responds status 404 when job is not found', async () => {
      await request(app.getHttpServer())
        .get('/jobs/2/reject')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/jobs (POST)', () => {
    it('successfully creates new job', async () => {
      const createJobDto: CreateJobDto = {
        runner: 'SkillSubjectMerge',
        description: 'Vuejs -> Vue.js',

        data: {
          sourceId: 1,
          targetId: 2,
        },
      };

      const response = await request(app.getHttpServer())
        .post('/jobs')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createJobDto)
        .expect(201);

      expect(response.body).toMatchObject({ ...createJobDto, id: 1 });
    });

    it('fails and responds status 400 when runner is empty', async () => {
      const newJob = { runner: '' };
      await request(app.getHttpServer())
        .post('/jobs')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newJob)
        .expect(400);
    });
  });
});
