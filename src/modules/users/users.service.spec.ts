import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './repo/users.repository';
import { AuthService } from '../auth/auth.service';
import { Role } from '../../common/enums/role.enum';

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

  describe('register', () => {
    it('should assign BUYER role by default if none provided', async () => {
      mockUsersRepository.mailExists.mockResolvedValue(false);
      mockAuthService.hashPassword.mockResolvedValue('hashed_pw');
      mockUsersRepository.save.mockImplementation((user: any) => Promise.resolve(user));

      const res = await service.register({
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(res.role).toBe(Role.BUYER);
    });

    it('should allow assigning SELLER role', async () => {
      mockUsersRepository.mailExists.mockResolvedValue(false);
      mockAuthService.hashPassword.mockResolvedValue('hashed_pw');
      mockUsersRepository.save.mockImplementation((user: any) => Promise.resolve(user));

      const res = await service.register({
        email: 'seller@example.com',
        password: 'password',
        firstName: 'Jane',
        lastName: 'Doe',
        role: Role.SELLER,
      });

      expect(res.role).toBe(Role.SELLER);
    });
  });

  describe('createAdmin', () => {
    it('should assign ADMIN role', async () => {
      mockUsersRepository.mailExists.mockResolvedValue(false);
      mockAuthService.hashPassword.mockResolvedValue('hashed_pw');
      mockUsersRepository.save.mockImplementation((user: any) => Promise.resolve(user));

      const res = await service.createAdmin({
        email: 'admin@example.com',
        password: 'password',
        firstName: 'Super',
        lastName: 'Admin',
      });

      expect(res.role).toBe(Role.ADMIN);
    });
  });
});
