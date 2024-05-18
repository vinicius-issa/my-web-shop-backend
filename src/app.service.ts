import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const value = process.env.DATABASE_URL;
    return value;
  }
}
