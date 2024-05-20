import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthModule } from '../src/auth/auth.module';

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
});
