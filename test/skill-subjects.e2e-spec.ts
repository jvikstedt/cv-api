import * as request from 'supertest';
import { factory } from 'typeorm-seeding';
import { INestApplication } from '@nestjs/common';
import { SkillSubject } from '../src/skill_subjects/skill-subject.entity';
import { SkillGroup } from '../src/skill_groups/skill-group.entity';
import { TestHelper } from './test-helper';
import { User } from '../src/users/user.entity';
import { CV } from '../src/cv/cv.entity';
import { PatchSkillSubjectDto } from '../src/skill_subjects/dto/patch-skill-subject.dto';

describe('SkillSubjectsController (e2e)', () => {
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

  it('/skill_subjects (GET)', async () => {
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject = await factory(SkillSubject)().create({
      skillGroupId: skillGroup.id,
    });
    const response = await request(app.getHttpServer())
      .get('/skill_subjects')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toStrictEqual([
      {
        ...skillSubject,
        createdAt: skillSubject.createdAt.toJSON(),
        updatedAt: skillSubject.updatedAt.toJSON(),
        skillGroup: {
          ...skillGroup,
          createdAt: skillGroup.createdAt.toJSON(),
          updatedAt: skillGroup.updatedAt.toJSON(),
        },
      },
    ]);
  });

  it('/skill_subjects/:id (GET)', async () => {
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject = await factory(SkillSubject)().create({
      skillGroupId: skillGroup.id,
    });
    const response = await request(app.getHttpServer())
      .get(`/skill_subjects/${skillSubject.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toStrictEqual({
      ...skillSubject,
      createdAt: skillSubject.createdAt.toJSON(),
      updatedAt: skillSubject.updatedAt.toJSON(),
      skillGroup: {
        ...skillGroup,
        createdAt: skillGroup.createdAt.toJSON(),
        updatedAt: skillGroup.updatedAt.toJSON(),
      },
    });

    await request(app.getHttpServer())
      .get('/skill_subjects/2')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('/skill_subjects/:id (DELETE)', async () => {
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject = await factory(SkillSubject)().create({
      skillGroupId: skillGroup.id,
    });
    const response = await request(app.getHttpServer())
      .delete(`/skill_subjects/${skillSubject.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual({});

    await request(app.getHttpServer())
      .get('/skill_subjects/2')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('/skill_subjects (POST)', async () => {
    const skillGroup = await factory(SkillGroup)().create();
    let newSkillSubject = await factory(SkillSubject)().make({
      skillGroupId: skillGroup.id,
    });

    const response = await request(app.getHttpServer())
      .post('/skill_subjects')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newSkillSubject)
      .expect(201);

    expect(response.body).toMatchObject({ ...newSkillSubject, id: 1 });

    newSkillSubject = await factory(SkillSubject)().make({ name: '' });
    await request(app.getHttpServer())
      .post('/skill_subjects')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newSkillSubject)
      .expect(400);
  });

  describe('/skill_subjects/:skillSubjectId (PATCH)', () => {
    it('updates skillSubject', async () => {
      const skillGroup = await factory(SkillGroup)().create();
      const skillSubject = await factory(SkillSubject)().create({
        skillGroupId: skillGroup.id,
      });

      const patchSkillSubjectDto: PatchSkillSubjectDto = {
        name: 'vue',
      };

      const response = await request(app.getHttpServer())
        .patch(`/skill_subjects/${skillSubject.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchSkillSubjectDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: skillSubject.id,
        name: patchSkillSubjectDto.name,
      });
    });
  });
});
