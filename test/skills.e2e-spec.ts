import * as R from 'ramda';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { factory, useSeeding } from 'typeorm-seeding';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Skill } from '../src/skills/skill.entity';
import { User } from '../src/users/user.entity';
import { SkillSubject } from '../src/skill_subjects/skill-subject.entity';
import { SkillGroup } from '../src/skill_groups/skill-group.entity';
import { CV } from '../src/cv/cv.entity';
import { AppModule } from '../src/app.module';
import { JwtPayload } from '../src/auth/jwt-payload.interface';

const generateAccessToken = (jwtService: JwtService, user: User): string => {
  const payload: JwtPayload = {
    userId: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    cvIds: [user.cv.id],
    templateIds: R.map(t => t.id, user.templates),
  };
  return jwtService.sign(payload);
}

describe('SkillsController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = module.createNestApplication();
    await app.init();

    connection = module.get<Connection>(Connection);
    jwtService = module.get<JwtService>(JwtService);

    await useSeeding();
  });

  beforeEach(async () => {
    await connection.synchronize(true);
  });

  afterAll(async (done) => {
    await connection.synchronize(true);
    await app.close();
    done();
  });

  it('/cv/:cvId/skills (GET)', async () => {
    const user = await factory(User)().create();
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject = await factory(SkillSubject)().create({ skillGroupId: skillGroup.id });
    const cv = await factory(CV)().create({ userId: user.id });
    const skill = await factory(Skill)().create({ cvId: cv.id, skillSubjectId: skillSubject.id });
    user.cv = cv;
    user.templates = [];

    const accessToken = generateAccessToken(jwtService, user);

    const response = await request(app.getHttpServer())
      .get(`/cv/${cv.id}/skills`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)

    expect(response.body).toMatchObject([
      {
        ...skill,
        createdAt: skill.createdAt.toJSON(),
        updatedAt: skill.updatedAt.toJSON(),
      }
    ]);
  });

  it('/cv/:cvId/skills/:skillId (GET)', async () => {
    const user = await factory(User)().create();
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject = await factory(SkillSubject)().create({ skillGroupId: skillGroup.id });
    const cv = await factory(CV)().create({ userId: user.id });
    const skill = await factory(Skill)().create({ cvId: cv.id, skillSubjectId: skillSubject.id });
    user.cv = cv;
    user.templates = [];

    const accessToken = generateAccessToken(jwtService, user);

    const response = await request(app.getHttpServer())
      .get(`/cv/${cv.id}/skills/${skill.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)

    expect(response.body).toMatchObject({
      ...skill,
      createdAt: skill.createdAt.toJSON(),
      updatedAt: skill.updatedAt.toJSON(),
    });

    await request(app.getHttpServer())
      .get(`/cv/${cv.id}/skills/2`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404)
  });

  it('/cv/:cvId/skills (POST)', async () => {
    const user = await factory(User)().create();
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject = await factory(SkillSubject)().create({ skillGroupId: skillGroup.id });
    const cv = await factory(CV)().create({ userId: user.id });
    user.cv = cv;
    user.templates = [];

    const accessToken = generateAccessToken(jwtService, user);

    const response = await request(app.getHttpServer())
      .post(`/cv/${cv.id}/skills`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ skillSubjectId: skillSubject.id, experienceInYears: 2 })
      .expect(201)

    expect(response.body).toMatchObject({ id: 1, cvId: cv.id, skillSubjectId: skillSubject.id, experienceInYears: 2 });;
  });

  it('/cv/:cvId/skills/:skillId (DELETE)', async () => {
    const user = await factory(User)().create();
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject = await factory(SkillSubject)().create({ skillGroupId: skillGroup.id });
    const cv = await factory(CV)().create({ userId: user.id });
    const skill = await factory(Skill)().create({ cvId: cv.id, skillSubjectId: skillSubject.id });
    user.cv = cv;
    user.templates = [];

    const accessToken = generateAccessToken(jwtService, user);

    const response = await request(app.getHttpServer())
      .delete(`/cv/${cv.id}/skills/${skill.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)

    expect(response.body).toMatchObject({ experienceInYears: skill.experienceInYears });;

    await request(app.getHttpServer())
      .get(`/cv/${cv.id}/skills/${skill.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404)
  });
});
