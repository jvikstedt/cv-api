import * as request from 'supertest';
import { useSeeding, factory } from 'typeorm-seeding';
import { Test } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { SkillSubject } from '../src/skill_subjects/skill-subject.entity';
import { SkillGroup } from '../src/skill_groups/skill-group.entity';
import { AppModule } from '../src/app.module';

describe('SkillSubjectsController (e2e)', () => {
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

  it('/skill_subjects (GET)', async () => {
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject = await factory(SkillSubject)().create({ skillGroupId: skillGroup.id });
    const response = await request(app.getHttpServer())
      .get('/skill_subjects')
      .expect(200)

    expect(response.body).toStrictEqual([
      {
        ...skillSubject,
        createdAt: skillSubject.createdAt.toJSON(),
        updatedAt: skillSubject.updatedAt.toJSON(),
        skillGroup: {
          ...skillGroup,
          createdAt: skillGroup.createdAt.toJSON(),
          updatedAt: skillGroup.updatedAt.toJSON(),
        }
      }
    ]);
  });

  it('/skill_subjects/:id (GET)', async () => {
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject = await factory(SkillSubject)().create({ skillGroupId: skillGroup.id });
    const response = await request(app.getHttpServer())
      .get(`/skill_subjects/${skillSubject.id}`)
      .expect(200)

    expect(response.body).toStrictEqual({
      ...skillSubject,
      createdAt: skillSubject.createdAt.toJSON(),
      updatedAt: skillSubject.updatedAt.toJSON(),
      skillGroup: {
        ...skillGroup,
        createdAt: skillGroup.createdAt.toJSON(),
        updatedAt: skillGroup.updatedAt.toJSON(),
      }
    });


    await request(app.getHttpServer())
      .get('/skill_subjects/2')
      .expect(404)
  });

  it('/skill_subjects/:id (DELETE)', async () => {
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject = await factory(SkillSubject)().create({ skillGroupId: skillGroup.id });
    const response = await request(app.getHttpServer())
      .delete(`/skill_subjects/${skillSubject.id}`)
      .expect(200)

    expect(response.body).toEqual({});

    await request(app.getHttpServer())
      .get('/skill_subjects/2')
      .expect(404)
  });

  it('/skill_subjects (POST)', async () => {
    const skillGroup = await factory(SkillGroup)().create();
    let newSkillSubject = await factory(SkillSubject)().make({ skillGroupId: skillGroup.id });

    const response = await request(app.getHttpServer())
      .post('/skill_subjects')
      .send(newSkillSubject)
      .expect(201)

    expect(response.body).toMatchObject({ ...newSkillSubject, id: 1 });;

    newSkillSubject = await factory(SkillSubject)().make({ name: '' });
    await request(app.getHttpServer())
      .post('/skill_subjects')
      .send(newSkillSubject)
      .expect(400)
  });

  it('/skill_subjects/:id (PUT)', async () => {
    const skillGroup = await factory(SkillGroup)().create();
    const skillSubject = await factory(SkillSubject)().create({ skillGroupId: skillGroup.id });

    let changes = await factory(SkillSubject)().make({ name: 'Vue.js' });
    const response = await request(app.getHttpServer())
      .put(`/skill_subjects/${skillSubject.id}`)
      .send(changes)
      .expect(200)

    expect(response.body).toMatchObject({ ...changes, id: 1 });;

    await request(app.getHttpServer())
      .post('/skill_subjects/2')
      .send(changes)
      .expect(404)

    changes = await factory(SkillSubject)().make({ name: '' });
    await request(app.getHttpServer())
      .put(`/skill_subjects/${skillSubject.id}`)
      .send(changes)
      .expect(400)
  });
});
