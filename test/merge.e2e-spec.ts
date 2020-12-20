import * as request from 'supertest';
import { factory } from 'typeorm-seeding';
import { INestApplication } from '@nestjs/common';
import { TestHelper } from './test-helper';
import { User } from '../src/users/user.entity';
import { CV } from '../src/cv/cv.entity';
import { Role } from '../src/roles/role.entity';
import { ADMIN_ROLE } from '../src/constants';
import { SkillSubject } from '../src/skill_subjects/skill-subject.entity';
import { SkillGroup } from '../src/skill_groups/skill-group.entity';

describe('MergeController (e2e)', () => {
  const testHelper: TestHelper = new TestHelper();
  let app: INestApplication;

  let user: User;
  let admin: User;
  let cv: CV;
  let adminCV: CV;
  let accessToken: string;
  let adminToken: string;

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
    adminToken = testHelper.sign(admin);
  });

  afterAll(async (done) => {
    await testHelper.resetDb();
    await testHelper.close();
    done();
  });

  describe('/merge/skill_subjects (POST)', () => {
    it('responds with 401 when not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/merge/skill_subjects')
        .expect(401);
    });

    it('responds with 403 when not admin', async () => {
      await request(app.getHttpServer())
        .post('/merge/skill_subjects')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });

    it('responds with 400 when invalid data', async () => {
      await request(app.getHttpServer())
        .post('/merge/skill_subjects')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);
    });

    it('responds with 404 when skill subjects not found', async () => {
      await request(app.getHttpServer())
        .post('/merge/skill_subjects')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          sourceId: 998,
          targetId: 999,
        })
        .expect(404);
    });

    it('successfully merges two skill subjects', async () => {
      const skillGroup = await factory(SkillGroup)().create();
      const sourceSkillSubject = await factory(SkillSubject)().create({
        skillGroupId: skillGroup.id,
      });
      const targetSkillSubject = await factory(SkillSubject)().create({
        skillGroupId: skillGroup.id,
      });
      await request(app.getHttpServer())
        .post('/merge/skill_subjects')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          sourceId: sourceSkillSubject.id,
          targetId: targetSkillSubject.id,
        })
        .expect(200);

      const queryRunner = testHelper.connection.createQueryRunner();
      const skillSubjects = await queryRunner.manager.find(SkillSubject);
      expect(skillSubjects.length).toEqual(1);
      expect(skillSubjects[0].name).toEqual(targetSkillSubject.name);
    });
  });
});
