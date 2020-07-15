import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TestHelper } from './test-helper';

describe('HealthController (e2e)', () => {
  const testHelper: TestHelper = new TestHelper();
  let app: INestApplication;

  beforeAll(async () => {
    await testHelper.setup();
    app = testHelper.app;
  });

  afterAll(async (done) => {
    await testHelper.resetDb();
    await testHelper.close();
    done();
  });

  it('/health (GET)', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200);
  });
});
