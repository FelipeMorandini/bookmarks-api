import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';
import * as argon from 'argon2';

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
  });
});
