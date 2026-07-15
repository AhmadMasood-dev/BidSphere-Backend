import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './repo/users.repository';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth/auth.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password, firstName, lastName } = registerUserDto;
    const exists = await this.userRepository.mailExists(email);

    if (exists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.authService.hashPassword(password);

    const user = new User();
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.password = hashedPassword;

    return this.userRepository.save(user);
  }

  async login(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.userRepository.findUserByEmail(loginUserDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await this.userRepository.validatePassword(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const { password, ...result } = user;
    return result as User;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.firstName !== undefined) {
      user.firstName = updateUserDto.firstName;
    }
    if (updateUserDto.lastName !== undefined) {
      user.lastName = updateUserDto.lastName;
    }
    if (updateUserDto.password !== undefined) {
      user.password = await this.authService.hashPassword(
        updateUserDto.password,
      );
    }
    if (updateUserDto.email !== undefined) {
      if (updateUserDto.email !== user.email) {
        const exists = await this.userRepository.mailExists(
          updateUserDto.email,
        );
        if (exists) {
          throw new ConflictException('Email already in use');
        }
        user.email = updateUserDto.email;
      }
    }
    return this.userRepository.save(user);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
