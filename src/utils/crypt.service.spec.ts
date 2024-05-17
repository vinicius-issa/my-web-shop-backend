import { Test, TestingModule } from '@nestjs/testing';
import { CryptService } from './crypt.service';
import * as bcrypt from 'bcrypt';

describe('CryptService', () => {
  let service: CryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptService,
        {
          provide: 'BCrypt',
          useValue: bcrypt,
        },
      ],
    }).compile();

    service = module.get<CryptService>(CryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a hash', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => Promise.resolve('test'));
    const hash = await service.hash('Test');
    return expect(hash).toEqual('test');
  });

  it('should return the compare as true if bcrypt lib returns true', async () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementationOnce(() => Promise.resolve(true));
    const hash = await service.compare('Test', '123');
    return expect(hash).toEqual(true);
  });
});
