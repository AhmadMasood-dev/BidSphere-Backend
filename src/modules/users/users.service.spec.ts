import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './repo/users.repository';
import { AuthService } from '../auth/auth.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepository: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockUsersRepository = {
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
      mailExists: jest.fn(),
      validatePassword: jest.fn(),
    };

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
