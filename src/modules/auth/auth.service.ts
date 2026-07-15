import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }
  comparePasswords(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash);
  }
}
