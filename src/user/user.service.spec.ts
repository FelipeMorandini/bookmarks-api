import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('editUser', () => {
    it('should successfully update and return user without password', async () => {
      const userId = 1;
      const dto: EditUserDto = { email: 'newemail@example.com' };
      const mockUser = {
        id: userId,
        email: 'newemail@example.com',
        password: 'hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
      };

      prismaService.user.update = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.editUser(userId, dto);

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(dto.email);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: dto,
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = 999;
      const dto: EditUserDto = { email: 'newemail@example.com' };

      const prismaError = new PrismaClientKnownRequestError(
        `User with ID ${userId} not found`,
        {
          code: 'P2025',
          clientVersion: '2.x.x',
        },
      );

      prismaService.user.update = jest.fn().mockRejectedValue(prismaError);

      await expect(userService.editUser(userId, dto)).rejects.toThrow(
        new NotFoundException(`User with ID ${userId} not found`),
      );
    });

    it('should propagate unknown errors', async () => {
      const userId = 1;
      const dto: EditUserDto = { email: 'test@example.com' };
      const unknownError = new Error('Database connection failed');

      prismaService.user.update = jest.fn().mockRejectedValue(unknownError);

      await expect(userService.editUser(userId, dto)).rejects.toThrow(
        unknownError,
      );
    });

    it('should handle partial updates with multiple fields', async () => {
      const userId = 1;
      const dto: EditUserDto = {
        email: 'newemail@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      };
      const mockUser = {
        id: userId,
        ...dto,
        password: 'hashedpassword',
      };

      prismaService.user.update = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.editUser(userId, dto);

      expect(result).toEqual({
        id: userId,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
      });
    });

    it('should handle empty dto object', async () => {
      const userId = 1;
      const dto: EditUserDto = {};
      const mockUser = {
        id: userId,
        email: 'existing@example.com',
        password: 'hashedpassword',
      };

      prismaService.user.update = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.editUser(userId, dto);
      expect(result).not.toHaveProperty('password');
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: dto,
      });
    });

    it('should verify the update method is called with correct parameters', async () => {
      const userId = 1;
      const dto: EditUserDto = { email: 'test@example.com' };
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        password: 'hashedpassword',
      };

      prismaService.user.update = jest.fn().mockResolvedValue(mockUser);

      await userService.editUser(userId, dto);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: dto,
      });
    });

    it('should return the user object with password removed', async () => {
      const userId = 1;
      const dto: EditUserDto = { email: 'test@example.com' };
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        password: 'hashedpassword',
        firstName: 'John',
      };

      prismaService.user.update = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.editUser(userId, dto);

      expect(result).not.toHaveProperty('password');
      expect(result).toEqual({
        id: userId,
        email: 'test@example.com',
        firstName: 'John',
      });
    });

    it('should handle different Prisma error codes', async () => {
      const userId = 1;
      const dto: EditUserDto = { email: 'test@example.com' };
      const prismaError = new PrismaClientKnownRequestError('Different error', {
        code: 'P2002', // Unique constraint error
        clientVersion: '2.x.x',
      });

      prismaService.user.update = jest.fn().mockRejectedValue(prismaError);

      await expect(userService.editUser(userId, dto)).rejects.toThrow(
        prismaError,
      );
    });

    it('should handle null values in dto', async () => {
      const userId = 1;
      const dto: EditUserDto = { firstName: null };
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        firstName: null,
        password: 'hashedpassword',
      };

      prismaService.user.update = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.editUser(userId, dto);
      expect(result.firstName).toBeNull();
      expect(result).not.toHaveProperty('password');
    });

    it('should handle non-Prisma errors', async () => {
      const userId = 1;
      const dto: EditUserDto = { email: 'test@example.com' };
      const genericError = new Error('Generic error');

      prismaService.user.update = jest.fn().mockRejectedValue(genericError);

      await expect(userService.editUser(userId, dto)).rejects.toThrow(
        genericError,
      );
    });

    it('should handle Prisma errors with different codes', async () => {
      const userId = 1;
      const dto: EditUserDto = { email: 'test@example.com' };
      const prismaError = new PrismaClientKnownRequestError('Database error', {
        code: 'P2002',
        clientVersion: '2.x.x',
      });

      prismaService.user.update = jest.fn().mockRejectedValue(prismaError);

      await expect(userService.editUser(userId, dto)).rejects.toThrow(
        prismaError,
      );
    });

    it('should handle undefined errors', async () => {
      const userId = 1;
      const dto: EditUserDto = { email: 'test@example.com' };

      prismaService.user.update = jest.fn().mockRejectedValue(new Error());

      await expect(userService.editUser(userId, dto)).rejects.toThrow();
    });

    it('should handle non-PrismaClientKnownRequestError', async () => {
      const userId = 1;
      const dto: EditUserDto = { email: 'test@example.com' };
      const customError = {
        name: 'CustomError',
        message: 'Custom error message',
      };

      prismaService.user.update = jest.fn().mockRejectedValue(customError);

      await expect(userService.editUser(userId, dto)).rejects.toEqual(
        customError,
      );
    });

    it('should handle PrismaClientKnownRequestError with non-P2025 code', async () => {
      const userId = 1;
      const dto: EditUserDto = { email: 'test@example.com' };
      const prismaError = new PrismaClientKnownRequestError(
        'Custom Prisma error',
        {
          code: 'P2002',
          clientVersion: '2.x.x',
        },
      );

      prismaService.user.update = jest.fn().mockRejectedValue(prismaError);

      await expect(userService.editUser(userId, dto)).rejects.toThrow(
        prismaError,
      );
    });

    it('should handle Error instances', async () => {
      const userId = 1;
      const dto: EditUserDto = { email: 'test@example.com' };
      const error = new Error('Standard error');

      prismaService.user.update = jest.fn().mockRejectedValue(error);

      await expect(userService.editUser(userId, dto)).rejects.toThrow(error);
    });

    it('should directly call the error handler when update fails', async () => {
      const userId = 1;
      const dto: EditUserDto = { email: 'test@example.com' };

      prismaService.user.update = jest.fn().mockRejectedValue(
        new PrismaClientKnownRequestError(`User with ID ${userId} not found`, {
          code: 'P2025',
          clientVersion: '2.x.x',
        }),
      );

      await expect(userService.editUser(userId, dto)).rejects.toThrow(
        new NotFoundException(`User with ID ${userId} not found`),
      );
    });

    it('should handle the error and throw NotFoundException', async () => {
      const userId = 1;
      const dto: EditUserDto = { email: 'test@example.com' };

      prismaService.user.update = jest.fn().mockRejectedValue(
        new PrismaClientKnownRequestError(`User with ID ${userId} not found`, {
          code: 'P2025',
          clientVersion: '2.x.x',
        }),
      );

      await expect(userService.editUser(userId, dto)).rejects.toThrow(
        new NotFoundException(`User with ID ${userId} not found`),
      );
    });

    it('should ensure error handler returns/throws properly', async () => {
      const userId = 1;
      const dto: EditUserDto = { email: 'test@example.com' };
      const error = new Error('Test error');

      prismaService.user.update = jest.fn().mockRejectedValue(error);

      const promise = userService.editUser(userId, dto);

      await expect(promise).rejects.toThrow(error);
    });
  });
});
