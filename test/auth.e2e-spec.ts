import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthModule } from '../src/auth/auth.module';
import { UtilsModule } from '../src/utils/utils.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
  });

  afterAll(async () => {
    if (mongod) {
      return await mongod.stop();
    }
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri()),
        AuthModule,
        AppModule,
        UtilsModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/auth/signup (POST) should create with success', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'User Test',
        email: 'user@test.com',
        password: '123456',
      })
      .expect(201);
  });

  it('/auth/signup (POST) should return an error if a field is missi', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'User Test',
        email: 'user@test.com',
      })
      .expect(400);
  });

  it('/auth/signin (POST) should authenticate user with success', async () => {
    await request(app.getHttpServer()).post('/auth/signup').send({
      name: 'User Test',
      email: 'user2@test.com',
      password: '123456',
    });

    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'user2@test.com',
        password: '123456',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.token).not.toBeNull;
        expect(res.body.refreshToken).not.toBeNull;
        expect(res.body.type).toEqual('Bearer');
      });
  });

  it('/auth/signin (POST) should return 401 if user not exist', async () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'user-not-exist@test.com',
        password: '123456',
      })
      .expect(401);
  });

  it('/auth/signin (POST) should return 401 if password is wrong', async () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'user2@test.com',
        password: '654321',
      })
      .expect(401);
  });

  it('/auth/signin (POST) should return 400 if no password', async () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'user2@test.com',
      })
      .expect(400);
  });

  it('/auth/signin (POST) should return 400 if no email', async () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        password: '123456',
      })
      .expect(400);
  });
});
