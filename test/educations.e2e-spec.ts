import * as request from 'supertest';
import { factory } from 'typeorm-seeding';
import { INestApplication } from '@nestjs/common';
import { Education } from '../src/educations/education.entity';
import { User } from '../src/users/user.entity';
import { School } from '../src/schools/school.entity';
import { CV } from '../src/cv/cv.entity';
import { PatchEducationDto } from '../src/educations/dto/patch-education.dto';
import { TestHelper } from './test-helper';

describe('EducationsController (e2e)', () => {
  const testHelper: TestHelper = new TestHelper();
  let app: INestApplication;

  let user: User;
  let cv: CV;
  let school: School;
  let accessToken: string;

  beforeAll(async () => {
    await testHelper.setup();
    app = testHelper.app;
  });

  beforeEach(async () => {
    await testHelper.resetDb();

    user = await factory(User)().create();
    school = await factory(School)().create();
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

  describe('/cv/:cvId/educations (POST)', () => {
    it('creates education when adding to own cv', async () => {
      const response = await request(app.getHttpServer())
        .post(`/cv/${cv.id}/educations`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          schoolId: school.id,
          degree: "Bachelor's degree, Information Technology",
          fieldOfStudy: 'Computer Software Engineering',
          description: '',
          startYear: 2000,
          highlight: false,
        })
        .expect(201)

      expect(response.body).toMatchObject({
        id: 1,
        cvId: cv.id,
        schoolId: school.id,
        degree: "Bachelor's degree, Information Technology",
        fieldOfStudy: 'Computer Software Engineering',
        description: '',
        startYear: 2000,
      });;
    });

    it('responds with forbidden (403) when trying to add education to someone elses cv', async () => {
      await request(app.getHttpServer())
        .post('/cv/10/educations')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ schoolId: school.id, description: '' })
        .expect(403)
    });
  });


  describe('/cv/:cvId/educations/:educationId (PATCH)', () => {
    let education: Education;
    let patchEducationDto: PatchEducationDto;

    beforeEach(async () => {
      education = await factory(Education)().create({
        cvId: cv.id,
        schoolId: school.id,
      });

      patchEducationDto = {
        description: 'new description',
      };
    });

    it('updates education', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/cv/${cv.id}/educations/${education.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchEducationDto)
        .expect(200)

      expect(response.body).toMatchObject({
        id: education.id,
        cvId: cv.id,
        ...patchEducationDto,
      });;
    });

    it('responds with forbidden (403) when trying to modify education to someone elses cv', async () => {
      await request(app.getHttpServer())
        .patch(`/cv/10/educations/${education.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchEducationDto)
        .expect(403)
    });
  });

  describe('/cv/:cvId/educations (GET)', () => {
    it('returns educations', async () => {
      const education = await factory(Education)().create({ cvId: cv.id, schoolId: school.id });

      const response = await request(app.getHttpServer())
        .get(`/cv/${cv.id}/educations`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body).toMatchObject([
        {
          ...education,
          createdAt: education.createdAt.toJSON(),
          updatedAt: education.updatedAt.toJSON(),
        }
      ]);
    });
  });

  describe('/cv/:cvId/educations/:educationId (GET)', () => {
    it('returns education', async () => {
      const education = await factory(Education)().create({ cvId: cv.id, schoolId: school.id });

      const response = await request(app.getHttpServer())
        .get(`/cv/${cv.id}/educations/${education.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body).toMatchObject({
        ...education,
        createdAt: education.createdAt.toJSON(),
        updatedAt: education.updatedAt.toJSON(),
      });

      await request(app.getHttpServer())
        .get(`/cv/${cv.id}/educations/2`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
    });
  });

  describe('/cv/:cvId/educations/:educationId (DELETE)', () => {
    let education: Education;

    beforeEach(async () => {
      education = await factory(Education)().create({
        cvId: cv.id,
        schoolId: school.id,
      });
    });

    it('deletes education', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/cv/${cv.id}/educations/${education.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body).toMatchObject({ degree: education.degree });;

      await request(app.getHttpServer())
        .get(`/cv/${cv.id}/educations/${education.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
    });

    it('responds with forbidden (403) when trying to delete education from someone elses cv', async () => {
      await request(app.getHttpServer())
        .delete(`/cv/10/educations/${education.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403)
    });
  });
});
