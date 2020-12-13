import * as request from 'supertest';
import { factory } from 'typeorm-seeding';
import { INestApplication } from '@nestjs/common';
import { Company } from '../src/company/company.entity';
import { PatchCompanyDto } from '../src/company/dto/patch-company.dto';
import { TestHelper } from './test-helper';
import { User } from '../src/users/user.entity';
import { CV } from '../src/cv/cv.entity';
import { Role } from '../src/roles/role.entity';
import { ADMIN_ROLE } from '../src/constants';

describe('CompanyController (e2e)', () => {
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

  describe('/company (GET)', () => {
    it('successfully retrieves all companies', async () => {
      const company = await factory(Company)().create();
      const response = await request(app.getHttpServer())
        .get('/company')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual([
        {
          ...company,
          createdAt: company.createdAt.toJSON(),
          updatedAt: company.updatedAt.toJSON(),
        },
      ]);
    });

    it('responds with 401 when not authenticated', async () => {
      await request(app.getHttpServer()).get('/company').expect(401);
    });
  });

  describe('/company/:id (GET)', () => {
    it('successfully responds requested company', async () => {
      const company = await factory(Company)().create();
      const response = await request(app.getHttpServer())
        .get(`/company/${company.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual({
        ...company,
        createdAt: company.createdAt.toJSON(),
        updatedAt: company.updatedAt.toJSON(),
      });
    });

    it('responds status 404 when company is not found', async () => {
      await request(app.getHttpServer())
        .get('/company/2')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/company/:id (DELETE)', () => {
    it('deletes company', async () => {
      const company = await factory(Company)().create();
      const response = await request(app.getHttpServer())
        .delete(`/company/${company.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toEqual({});
    });

    it('responds status 404 when company is not found', async () => {
      await request(app.getHttpServer())
        .get('/company/2')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/company (POST)', () => {
    it('successfully creates new company', async () => {
      const newCompany = await factory(Company)().make();

      const response = await request(app.getHttpServer())
        .post('/company')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newCompany)
        .expect(201);

      expect(response.body).toMatchObject({ ...newCompany, id: 1 });
    });

    it('fails and responds status 400 when name is empty', async () => {
      const newCompany = await factory(Company)().make({ name: '' });
      await request(app.getHttpServer())
        .post('/company')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newCompany)
        .expect(400);
    });
  });

  describe('/company/:companyId (PATCH)', () => {
    it('updates company', async () => {
      const company = await factory(Company)().create();

      const patchCompanyDto: PatchCompanyDto = {
        name: 'Company A',
      };

      const response = await request(app.getHttpServer())
        .patch(`/company/${company.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchCompanyDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: company.id,
        name: patchCompanyDto.name,
      });
    });
  });
});
