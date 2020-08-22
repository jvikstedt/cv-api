import * as request from 'supertest';
import { factory } from 'typeorm-seeding';
import { INestApplication } from '@nestjs/common';
import { Skill } from '../src/skills/skill.entity';
import { User } from '../src/users/user.entity';
import { SkillSubject } from '../src/skill_subjects/skill-subject.entity';
import { SkillGroup } from '../src/skill_groups/skill-group.entity';
import { CV } from '../src/cv/cv.entity';
import { PatchSkillDto } from '../src/skills/dto/patch-skill.dto';
import { TestHelper } from './test-helper';

describe('SkillsController (e2e)', () => {
  let app: INestApplication;

  let user: User;
  let cv: CV;
  let skillGroup: SkillGroup;
  let skillSubject: SkillSubject;
  let accessToken: string;

  const testHelper: TestHelper = new TestHelper();

  beforeAll(async () => {
    await testHelper.setup();
    app = testHelper.app;
  });

  beforeEach(async () => {
    await testHelper.resetDb();

    user = await factory(User)().create();
    skillGroup = await factory(SkillGroup)().create();
    skillSubject = await factory(SkillSubject)().create({
      skillGroupId: skillGroup.id,
    });
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

  describe('/cv/:cvId/skills (POST)', () => {
    it('creates skill when adding to own cv', async () => {
      const response = await request(app.getHttpServer())
        .post(`/cv/${cv.id}/skills`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          skillSubjectId: skillSubject.id,
          experienceInYears: 2,
          interestLevel: 1,
          highlight: false,
        })
        .expect(201);

      expect(response.body).toMatchObject({
        id: 1,
        cvId: cv.id,
        skillSubjectId: skillSubject.id,
        experienceInYears: 2,
        interestLevel: 1,
        highlight: false,
      });
    });

    it('responds with forbidden (403) when trying to add skill to someone elses cv', async () => {
      await request(app.getHttpServer())
        .post('/cv/10/skills')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ skillSubjectId: skillSubject.id, experienceInYears: 2 })
        .expect(403);
    });
  });

  describe('/cv/:cvId/skills/:skillId (PATCH)', () => {
    let skill: Skill;
    let patchSkillDto: PatchSkillDto;

    beforeEach(async () => {
      skill = await factory(Skill)().create({
        cvId: cv.id,
        skillSubjectId: skillSubject.id,
        experienceInYears: 1,
        interestLevel: 1,
      });

      patchSkillDto = {
        experienceInYears: 6,
      };
    });

    it('updates skill', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/cv/${cv.id}/skills/${skill.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchSkillDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: skill.id,
        cvId: cv.id,
        skillSubjectId: skillSubject.id,
        experienceInYears: 6,
        interestLevel: 1,
      });
    });

    it('responds with forbidden (403) when trying to modify skill to someone elses cv', async () => {
      await request(app.getHttpServer())
        .patch(`/cv/10/skills/${skill.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchSkillDto)
        .expect(403);
    });
  });

  describe('/cv/:cvId/skills (GET)', () => {
    it('returns skills', async () => {
      const skill = await factory(Skill)().create({
        cvId: cv.id,
        skillSubjectId: skillSubject.id,
      });

      const response = await request(app.getHttpServer())
        .get(`/cv/${cv.id}/skills`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject([
        {
          ...skill,
          createdAt: skill.createdAt.toJSON(),
          updatedAt: skill.updatedAt.toJSON(),
        },
      ]);
    });
  });

  describe('/cv/:cvId/skills/:skillId (GET)', () => {
    it('returns skill', async () => {
      const skill = await factory(Skill)().create({
        cvId: cv.id,
        skillSubjectId: skillSubject.id,
      });

      const response = await request(app.getHttpServer())
        .get(`/cv/${cv.id}/skills/${skill.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        ...skill,
        createdAt: skill.createdAt.toJSON(),
        updatedAt: skill.updatedAt.toJSON(),
      });

      await request(app.getHttpServer())
        .get(`/cv/${cv.id}/skills/2`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/cv/:cvId/skills/:skillId (DELETE)', () => {
    let skill: Skill;

    beforeEach(async () => {
      skill = await factory(Skill)().create({
        cvId: cv.id,
        skillSubjectId: skillSubject.id,
      });
    });

    it('deletes skill', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/cv/${cv.id}/skills/${skill.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        experienceInYears: skill.experienceInYears,
        interestLevel: skill.interestLevel,
      });

      await request(app.getHttpServer())
        .get(`/cv/${cv.id}/skills/${skill.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('responds with forbidden (403) when trying to delete skill from someone elses cv', async () => {
      await request(app.getHttpServer())
        .delete(`/cv/10/skills/${skill.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });
});
