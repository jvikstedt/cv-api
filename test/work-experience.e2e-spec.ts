import * as request from 'supertest';
import { factory } from 'typeorm-seeding';
import { INestApplication } from '@nestjs/common';
import { WorkExperience } from '../src/work_experience/work-experience.entity';
import { User } from '../src/users/user.entity';
import { Company } from '../src/company/company.entity';
import { CV } from '../src/cv/cv.entity';
import { PatchWorkExperienceDto } from '../src/work_experience/dto/patch-work-experience.dto';
import { TestHelper } from './test-helper';

describe('WorkExperienceController (e2e)', () => {
  const testHelper: TestHelper = new TestHelper();
  let app: INestApplication;

  let user: User;
  let cv: CV;
  let company: Company;
  let accessToken: string;

  beforeAll(async () => {
    await testHelper.setup();
    app = testHelper.app;
  });

  beforeEach(async () => {
    await testHelper.resetDb();

    user = await factory(User)().create();
    company = await factory(Company)().create();
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

  describe('/cv/:cvId/work_experience (POST)', () => {
    it('creates work_experience when adding to own cv', async () => {
      const response = await request(app.getHttpServer())
        .post(`/cv/${cv.id}/work_experience`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          companyId: company.id,
          description: '',
          jobTitle: 'Developer',
          startYear: 2000,
          startMonth: 1,
        })
        .expect(201)

      expect(response.body).toMatchObject({
        id: 1,
        cvId: cv.id,
        companyId: company.id,
        description: '',
        jobTitle: 'Developer',
        startYear: 2000,
        startMonth: 1,
      });;
    });

    it('responds with forbidden (403) when trying to add work_experience to someone elses cv', async () => {
      await request(app.getHttpServer())
        .post('/cv/10/work_experience')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ companyId: company.id, description: '' })
        .expect(403)
    });
  });


  describe('/cv/:cvId/work_experience/:workExperienceId (PATCH)', () => {
    let workExperience: WorkExperience;
    let patchWorkExperienceDto: PatchWorkExperienceDto;

    beforeEach(async () => {
      workExperience = await factory(WorkExperience)().create({
        cvId: cv.id,
        companyId: company.id,
      });

      patchWorkExperienceDto = {
        description: 'new description',
      };
    });

    it('updates workExperience', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/cv/${cv.id}/work_experience/${workExperience.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchWorkExperienceDto)
        .expect(200)

      expect(response.body).toMatchObject({
        id: workExperience.id,
        cvId: cv.id,
        ...patchWorkExperienceDto,
      });;
    });

    it('responds with forbidden (403) when trying to modify workExperience to someone elses cv', async () => {
      await request(app.getHttpServer())
        .patch(`/cv/10/work_experience/${workExperience.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchWorkExperienceDto)
        .expect(403)
    });
  });

  describe('/cv/:cvId/work_experience (GET)', () => {
    it('returns work_experience', async () => {
      const workExperience = await factory(WorkExperience)().create({ cvId: cv.id, companyId: company.id });

      const response = await request(app.getHttpServer())
        .get(`/cv/${cv.id}/work_experience`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body).toMatchObject([
        {
          ...workExperience,
          createdAt: workExperience.createdAt.toJSON(),
          updatedAt: workExperience.updatedAt.toJSON(),
        }
      ]);
    });
  });

  describe('/cv/:cvId/work_experience/:workExperienceId (GET)', () => {
    it('returns workExperience', async () => {
      const workExperience = await factory(WorkExperience)().create({ cvId: cv.id, companyId: company.id });

      const response = await request(app.getHttpServer())
        .get(`/cv/${cv.id}/work_experience/${workExperience.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body).toMatchObject({
        ...workExperience,
        createdAt: workExperience.createdAt.toJSON(),
        updatedAt: workExperience.updatedAt.toJSON(),
      });

      await request(app.getHttpServer())
        .get(`/cv/${cv.id}/work_experience/2`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
    });
  });

  describe('/cv/:cvId/work_experience/:workExperienceId (DELETE)', () => {
    let workExperience: WorkExperience;

    beforeEach(async () => {
      workExperience = await factory(WorkExperience)().create({
        cvId: cv.id,
        companyId: company.id,
      });
    });

    it('deletes workExperience', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/cv/${cv.id}/work_experience/${workExperience.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body).toMatchObject({ description: workExperience.description });;

      await request(app.getHttpServer())
        .get(`/cv/${cv.id}/work_experience/${workExperience.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
    });

    it('responds with forbidden (403) when trying to delete workExperience from someone elses cv', async () => {
      await request(app.getHttpServer())
        .delete(`/cv/10/work_experience/${workExperience.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403)
    });
  });
});
