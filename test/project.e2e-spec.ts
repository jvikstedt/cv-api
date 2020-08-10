import * as request from 'supertest';
import { factory } from 'typeorm-seeding';
import { INestApplication } from '@nestjs/common';
import { Project } from '../src/project/project.entity';
import { PatchProjectDto } from '../src/project/dto/patch-project.dto';
import { TestHelper } from './test-helper';
import { User } from '../src/users/user.entity';
import { CV } from '../src/cv/cv.entity';
import { Company } from '../src/company/company.entity';

describe('ProjectController (e2e)', () => {
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

  describe('/project (GET)', () => {
    it('successfully retrieves all companies', async () => {
      const company = await factory(Company)().create();
      const project = await factory(Project)().create({
        companyId: company.id,
      });
      const response = await request(app.getHttpServer())
        .get('/project')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual([
        {
          ...project,
          createdAt: project.createdAt.toJSON(),
          updatedAt: project.updatedAt.toJSON(),
          company: {
            ...company,
            createdAt: company.createdAt.toJSON(),
            updatedAt: company.updatedAt.toJSON(),
          },
        },
      ]);
    });

    it('responds with 401 when not authenticated', async () => {
      await request(app.getHttpServer()).get('/project').expect(401);
    });
  });

  describe('/project/:id (GET)', () => {
    it('successfully responds requested project', async () => {
      const company = await factory(Company)().create();
      const project = await factory(Project)().create({
        companyId: company.id,
      });
      const response = await request(app.getHttpServer())
        .get(`/project/${project.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual({
        ...project,
        createdAt: project.createdAt.toJSON(),
        updatedAt: project.updatedAt.toJSON(),
        company: {
          ...company,
          createdAt: company.createdAt.toJSON(),
          updatedAt: company.updatedAt.toJSON(),
        },
      });
    });

    it('responds status 404 when project is not found', async () => {
      await request(app.getHttpServer())
        .get('/project/2')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/project/:id (DELETE)', () => {
    it('deletes project', async () => {
      const company = await factory(Company)().create();
      const project = await factory(Project)().create({
        companyId: company.id,
      });
      const response = await request(app.getHttpServer())
        .delete(`/project/${project.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toEqual({});
    });

    it('responds status 404 when project is not found', async () => {
      await request(app.getHttpServer())
        .get('/project/2')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/project (POST)', () => {
    it('successfully creates new project', async () => {
      const company = await factory(Company)().create();
      const newProject = await factory(Project)().make({
        companyId: company.id,
      });

      const response = await request(app.getHttpServer())
        .post('/project')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newProject)
        .expect(201);

      expect(response.body).toMatchObject({ ...newProject, id: 1 });
    });

    it('fails and responds status 400 when name is empty', async () => {
      const newProject = await factory(Project)().make({ name: '' });
      await request(app.getHttpServer())
        .post('/project')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newProject)
        .expect(400);
    });
  });

  describe('/project/:projectId (PATCH)', () => {
    it('updates project', async () => {
      const company = await factory(Company)().create();
      const project = await factory(Project)().create({
        companyId: company.id,
      });

      const patchProjectDto: PatchProjectDto = {
        name: 'Project A',
      };

      const response = await request(app.getHttpServer())
        .patch(`/project/${project.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchProjectDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: project.id,
        name: patchProjectDto.name,
      });
    });
  });
});
