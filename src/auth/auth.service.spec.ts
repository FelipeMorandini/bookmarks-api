import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as module from 'node:module';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('signup', () => {
    it('should create a new user and return a token', async () => {
      const signUpDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const userId = 1;
      const hashedPassword = 'hashedPassword';
      const token = 'jwt_token';

      (argon.hash as jest.Mock).mockResolvedValue(hashedPassword);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        id: userId,
        email: signUpDto.email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: 'John',
        lastName: 'Doe',
      });
      jest
        .spyOn(authService, 'signToken')
        .mockResolvedValue({ access_token: token });

      const result = await authService.signup(signUpDto);

      expect(argon.hash).toHaveBeenCalledWith(signUpDto.password);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: signUpDto.email,
          password: hashedPassword,
          firstName: signUpDto.firstName,
          lastName: signUpDto.lastName,
        },
      });
      expect(authService.signToken).toHaveBeenCalledWith(
        userId,
        signUpDto.email,
      );
      expect(result).toEqual({ access_token: token });
    });
    it('should handle Prisma unique constraint violation', async () => {
      const signUpDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const prismaError = new PrismaClientKnownRequestError('', {
        code: 'P2002',
        clientVersion: '2.0.0',
      });

      jest.spyOn(prismaService.user, 'create').mockRejectedValue(prismaError);

      await expect(authService.signup(signUpDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
    it('should propagate unknown errors during signup', async () => {
      const signUpDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const unknownError = new Error('Unknown error');
      jest.spyOn(prismaService.user, 'create').mockRejectedValue(unknownError);

      await expect(authService.signup(signUpDto)).rejects.toThrow(unknownError);
    });
  });

  describe('signin', () => {
    it('should authenticate user and return a token', async () => {
      const signInDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const user = {
        id: 1,
        email: signInDto.email,
        password: 'hashedPassword',
      };
      const token = 'jwt_token';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: 'John',
        lastName: 'Doe',
      });
      (argon.verify as jest.Mock).mockResolvedValue(true);
      jest
        .spyOn(authService, 'signToken')
        .mockResolvedValue({ access_token: token });

      const result = await authService.signin(signInDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: signInDto.email },
      });
      expect(argon.verify).toHaveBeenCalledWith(
        user.password,
        signInDto.password,
      );
      expect(authService.signToken).toHaveBeenCalledWith(user.id, user.email);
      expect(result).toEqual({ access_token: token });
    });

    it('should throw ForbiddenException if password is incorrect', async () => {
      const signInDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const user = {
        id: 1,
        email: signInDto.email,
        password: 'hashedPassword',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: 'John',
        lastName: 'Doe',
      });
      (argon.verify as jest.Mock).mockResolvedValue(false);

      await expect(authService.signin(signInDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
    it('should throw when user is not found during signin', async () => {
      const signInDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(authService.signin(signInDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should handle database errors during signin', async () => {
      const signInDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const dbError = new Error('Database connection failed');
      jest.spyOn(prismaService.user, 'findUnique').mockRejectedValue(dbError);

      await expect(authService.signin(signInDto)).rejects.toThrow(dbError);
    });
  });
  describe('signToken', () => {
    it('should generate a valid JWT token', async () => {
      const userId = 1;
      const email = 'test@example.com';
      const mockToken = 'mock.jwt.token';

      const jwtService = module.get<JwtService>(JwtService);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockToken);

      const result = await authService.signToken(userId, email);

      expect(result).toEqual({ access_token: mockToken });
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: userId, email },
        expect.any(Object),
      );
    });

    it('should use correct JWT configuration', async () => {
      const userId = 1;
      const email = 'test@example.com';
      const mockSecret = 'test-secret';

      const configService = module.get<ConfigService>(ConfigService);
      jest.spyOn(configService, 'get').mockReturnValue(mockSecret);

      const jwtService = module.get<JwtService>(JwtService);
      const signingSpy = jest.spyOn(jwtService, 'signAsync');

      await authService.signToken(userId, email);

      expect(signingSpy).toHaveBeenCalledWith(expect.any(Object), {
        expiresIn: '15m',
        secret: mockSecret,
      });
    });
  });
});
