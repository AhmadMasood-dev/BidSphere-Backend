import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly authService: AuthService,
  ) {
    super(User, dataSource.manager);
  }

  findUserByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async mailExists(email: string): Promise<boolean> {
    const count = await this.count({ where: { email } });
    return count > 0;
  }

  async validatePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return this.authService.comparePasswords(password, passwordHash);
  }
}
