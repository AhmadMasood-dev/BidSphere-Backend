import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './repo/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async register(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = new User();
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.password = password; // In a real application, make sure to hash the password before storing it

    return this.userRepository.save(user);
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = new User();
    user.firstName = updateUserDto.firstName || '';
    user.lastName = updateUserDto.lastName || '';
    user.password = updateUserDto.password || '';
    user.id = id;

    return this.userRepository.save(user);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
