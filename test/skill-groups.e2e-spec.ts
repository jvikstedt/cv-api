import * as request from 'supertest';
import { factory } from 'typeorm-seeding';
import { INestApplication } from '@nestjs/common';
import { SkillGroup } from '../src/skill_groups/skill-group.entity';
import { PatchSkillGroupDto } from '../src/skill_groups/dto/patch-skill-group.dto';
import { TestHelper } from './test-helper';
import { User } from '../src/users/user.entity';
import { CV } from '../src/cv/cv.entity';
import { Role } from '../src/roles/role.entity';
import { ADMIN_ROLE } from '../src/constants';

describe('SkillGroupsController (e2e)', () => {
  const testHelper: TestHelper = new TestHelper();
  let app: INestApplication;

  let user: User;
  let admin: User;
  let cv: CV;
  let adminCV: CV;
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

    const adminRole = await factory(Role)().create({ name: ADMIN_ROLE });
    admin = await factory(User)().create({ roles: [adminRole] });
    adminCV = await factory(CV)().create({ userId: admin.id });
    admin.cv = adminCV;
    admin.templates = [];

    accessToken = testHelper.sign(user);
  });

  afterAll(async (done) => {
    await testHelper.resetDb();
    await testHelper.close();
    done();
  });

  describe('/skill_groups (GET)', () => {
    it('successfully retrieves all skill groups', async () => {
      const skillGroup = await factory(SkillGroup)().create();
      const response = await request(app.getHttpServer())
        .get('/skill_groups')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual([
        {
          ...skillGroup,
          createdAt: skillGroup.createdAt.toJSON(),
          updatedAt: skillGroup.updatedAt.toJSON(),
        },
      ]);
    });

    it('responds with 401 when not authenticated', async () => {
      await request(app.getHttpServer()).get('/skill_groups').expect(401);
    });
  });

  describe('/skill_groups/:id (GET)', () => {
    it('successfully responds requested skill group', async () => {
      const skillGroup = await factory(SkillGroup)().create();
      const response = await request(app.getHttpServer())
        .get(`/skill_groups/${skillGroup.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual({
        ...skillGroup,
        createdAt: skillGroup.createdAt.toJSON(),
        updatedAt: skillGroup.updatedAt.toJSON(),
      });
    });

    it('responds status 404 when skill group is not found', async () => {
      await request(app.getHttpServer())
        .get('/skill_groups/2')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/skill_groups/:id (DELETE)', () => {
    it('deletes skill group', async () => {
      const skillGroup = await factory(SkillGroup)().create();
      const response = await request(app.getHttpServer())
        .delete(`/skill_groups/${skillGroup.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toEqual({});
    });

    it('responds status 404 when skill group is not found', async () => {
      await request(app.getHttpServer())
        .get('/skill_groups/2')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/skill_groups (POST)', () => {
    it('successfully creates new skill group', async () => {
      const newSkillGroup = await factory(SkillGroup)().make();

      const response = await request(app.getHttpServer())
        .post('/skill_groups')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newSkillGroup)
        .expect(201);

      expect(response.body).toMatchObject({ ...newSkillGroup, id: 1 });
    });

    it('fails and responds status 400 when name is empty', async () => {
      const newSkillGroup = await factory(SkillGroup)().make({ name: '' });
      await request(app.getHttpServer())
        .post('/skill_groups')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newSkillGroup)
        .expect(400);
    });
  });

  describe('/skill_groups/:skillGroupId (PATCH)', () => {
    it('updates skill group', async () => {
      const skillGroup = await factory(SkillGroup)().create();

      const patchSkillGroupDto: PatchSkillGroupDto = {
        name: 'SkillGroup A',
      };

      const response = await request(app.getHttpServer())
        .patch(`/skill_groups/${skillGroup.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchSkillGroupDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: skillGroup.id,
        name: patchSkillGroupDto.name,
      });
    });
  });
});
