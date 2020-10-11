import * as request from 'supertest';
import { factory } from 'typeorm-seeding';
import { INestApplication } from '@nestjs/common';
import { ProjectMembership } from '../src/project_membership/project-membership.entity';
import { User } from '../src/users/user.entity';
import { Project } from '../src/project/project.entity';
import { CV } from '../src/cv/cv.entity';
import { PatchProjectMembershipDto } from '../src/project_membership/dto/patch-project-membership.dto';
import { TestHelper } from './test-helper';
import { Company } from '../src/company/company.entity';

describe('ProjectMembershipController (e2e)', () => {
  const testHelper: TestHelper = new TestHelper();
  let app: INestApplication;

  let user: User;
  let cv: CV;
  let company: Company;
  let project: Project;
  let accessToken: string;

  beforeAll(async () => {
    await testHelper.setup();
    app = testHelper.app;
  });

  beforeEach(async () => {
    await testHelper.resetDb();

    user = await factory(User)().create();
    company = await factory(Company)().create();
    project = await factory(Project)().create({ companyId: company.id });
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

  describe('/cv/:cvId/project_membership (POST)', () => {
    it('creates project_membership when adding to own cv', async () => {
      const response = await request(app.getHttpServer())
        .post(`/cv/${cv.id}/project_membership`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          projectId: project.id,
          description: '',
          startYear: 2000,
          startMonth: 1,
          highlight: false,
          membershipSkills: [],
        })
        .expect(201);

      expect(response.body).toMatchObject({
        id: 1,
        cvId: cv.id,
        projectId: project.id,
        description: '',
        startYear: 2000,
        startMonth: 1,
      });
    });

    it('responds with forbidden (403) when trying to add project_membership to someone elses cv', async () => {
      await request(app.getHttpServer())
        .post('/cv/10/project_membership')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ projectId: project.id, description: '' })
        .expect(403);
    });
  });

  describe('/cv/:cvId/project_membership/:projectMembershipId (PATCH)', () => {
    let projectMembership: ProjectMembership;
    let patchProjectMembershipDto: PatchProjectMembershipDto;

    beforeEach(async () => {
      projectMembership = await factory(ProjectMembership)().create({
        cvId: cv.id,
        projectId: project.id,
      });

      patchProjectMembershipDto = {
        description: 'new description',
      };
    });

    it('updates projectMembership', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/cv/${cv.id}/project_membership/${projectMembership.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchProjectMembershipDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: projectMembership.id,
        cvId: cv.id,
        ...patchProjectMembershipDto,
      });
    });

    it('responds with forbidden (403) when trying to modify projectMembership to someone elses cv', async () => {
      await request(app.getHttpServer())
        .patch(`/cv/10/project_membership/${projectMembership.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchProjectMembershipDto)
        .expect(403);
    });
  });

  describe('/cv/:cvId/project_membership (GET)', () => {
    it('returns project_membership', async () => {
      const projectMembership = await factory(ProjectMembership)().create({
        cvId: cv.id,
        projectId: project.id,
      });

      const response = await request(app.getHttpServer())
        .get(`/cv/${cv.id}/project_membership`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject([
        {
          ...projectMembership,
          createdAt: projectMembership.createdAt.toJSON(),
          updatedAt: projectMembership.updatedAt.toJSON(),
        },
      ]);
    });
  });

  describe('/cv/:cvId/project_membership/:projectMembershipId (GET)', () => {
    it('returns projectMembership', async () => {
      const projectMembership = await factory(ProjectMembership)().create({
        cvId: cv.id,
        projectId: project.id,
      });

      const response = await request(app.getHttpServer())
        .get(`/cv/${cv.id}/project_membership/${projectMembership.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        ...projectMembership,
        createdAt: projectMembership.createdAt.toJSON(),
        updatedAt: projectMembership.updatedAt.toJSON(),
      });

      await request(app.getHttpServer())
        .get(`/cv/${cv.id}/project_membership/2`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/cv/:cvId/project_membership/:projectMembershipId (DELETE)', () => {
    let projectMembership: ProjectMembership;

    beforeEach(async () => {
      projectMembership = await factory(ProjectMembership)().create({
        cvId: cv.id,
        projectId: project.id,
      });
    });

    it('deletes projectMembership', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/cv/${cv.id}/project_membership/${projectMembership.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        description: projectMembership.description,
      });

      await request(app.getHttpServer())
        .get(`/cv/${cv.id}/project_membership/${projectMembership.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('responds with forbidden (403) when trying to delete projectMembership from someone elses cv', async () => {
      await request(app.getHttpServer())
        .delete(`/cv/10/project_membership/${projectMembership.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });
});
