import * as request from 'supertest';
import { factory, useSeeding } from 'typeorm-seeding';
import { Test } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Skill } from '../src/skills/skill.entity';
import { User } from '../src/users/user.entity';
import { SkillSubject } from '../src/skill_subjects/skill-subject.entity';
import { SkillGroup } from '../src/skill_groups/skill-group.entity';
import { CV } from '../src/cv/cv.entity';
import { AppModule } from '../src/app.module';

describe('SkillsController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideGuard(AuthGuard())
    .useValue({ canActivate: () => true })
    .compile();

    app = module.createNestApplication();
    await app.init();

    connection = module.get<Connection>(Connection);

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

  it('/skills (GET)', async () => {
    const user = await factory(User)().create();
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject = await factory(SkillSubject)().create({ skillGroupId: skillGroup.id });
    const cv = await factory(CV)().create({ userId: user.id });
    const skill = await factory(Skill)().create({ cvId: cv.id, skillSubjectId: skillSubject.id });

    const response = await request(app.getHttpServer())
      .get('/skills')
      .expect(200)

    expect(response.body).toMatchObject([
      {
        ...skill,
        createdAt: skill.createdAt.toJSON(),
        updatedAt: skill.updatedAt.toJSON(),
      }
    ]);
  });

  it('/skills/:id (GET)', async () => {
    const user = await factory(User)().create();
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject = await factory(SkillSubject)().create({ skillGroupId: skillGroup.id });
    const cv = await factory(CV)().create({ userId: user.id });
    const skill = await factory(Skill)().create({ cvId: cv.id, skillSubjectId: skillSubject.id });

    const response = await request(app.getHttpServer())
      .get(`/skills/${skill.id}`)
      .expect(200)

    expect(response.body).toMatchObject({
      ...skill,
      createdAt: skill.createdAt.toJSON(),
      updatedAt: skill.updatedAt.toJSON(),
    });

    await request(app.getHttpServer())
      .get('/skills/2')
      .expect(404)
  });

  it('/skills (POST)', async () => {
    const user = await factory(User)().create();
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject = await factory(SkillSubject)().create({ skillGroupId: skillGroup.id });
    const cv = await factory(CV)().create({ userId: user.id });

    const response = await request(app.getHttpServer())
      .post('/skills')
      .send({ skillSubjectId: skillSubject.id, cvId: cv.id, experienceInYears: 2 })
      .expect(201)

    expect(response.body).toMatchObject({ id: 1, cvId: cv.id, skillSubjectId: skillSubject.id, experienceInYears: 2 });;
  });

  it('/skills/:id (PUT)', async () => {
    const user = await factory(User)().create();
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject1 = await factory(SkillSubject)().create({ skillGroupId: skillGroup.id });
    const cv = await factory(CV)().create({ userId: user.id });
    const skill = await factory(Skill)().create({ cvId: cv.id, skillSubjectId: skillSubject1.id, experienceInYears: 1 });

    const changes = await factory(Skill)().make({ experienceInYears: 2 });
    const response = await request(app.getHttpServer())
      .put(`/skills/${skill.id}`)
      .send(changes)
      .expect(200)

    expect(response.body).toMatchObject({ ...changes, id: skill.id, experienceInYears: 2 });;

    await request(app.getHttpServer())
      .post('/skills/2')
      .send(changes)
      .expect(404)
  });

  it('/skills/:id (DELETE)', async () => {
    const user = await factory(User)().create();
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject = await factory(SkillSubject)().create({ skillGroupId: skillGroup.id });
    const cv = await factory(CV)().create({ userId: user.id });
    const skill = await factory(Skill)().create({ cvId: cv.id, skillSubjectId: skillSubject.id });

    const response = await request(app.getHttpServer())
      .delete(`/skills/${skill.id}`)
      .expect(200)

    expect(response.body).toMatchObject({ experienceInYears: skill.experienceInYears });;

    await request(app.getHttpServer())
      .get('/skills/2')
      .expect(404)
  });
});
