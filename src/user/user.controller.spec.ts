import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            editUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getMe', () => {
    it('should return the user object without password', () => {
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        password: 'hashedpassword',
      };
      const result = userController.getMe(mockUser);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...expectedUser } = mockUser;
      expect(result).toEqual({ user: expectedUser });
    });

    it('should return an object with user property without password', () => {
      const mockUser: User = {
        id: 2,
        email: 'test2@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        password: 'hashedpassword',
      };
      const result = userController.getMe(mockUser);
      expect(result).toHaveProperty('user');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should handle undefined user', () => {
      const result = userController.getMe(undefined);
      expect(result).toEqual({ user: undefined });
    });

    it('should handle null user', () => {
      const result = userController.getMe(null);
      expect(result).toEqual({ user: null });
    });
  });

  describe('editUser', () => {
    it('should call editUser method with correct parameters', async () => {
      const userId = 1;
      const dto: EditUserDto = {
        email: 'updated@example.com',
        firstName: 'UpdatedName'
      };

      await userController.editUser(userId, dto);

      expect(userService.editUser).toHaveBeenCalledWith(userId, dto);
    });

    it('should handle empty dto', async () => {
      const userId = 1;
      const dto: EditUserDto = {};

      await userController.editUser(userId, dto);

      expect(userService.editUser).toHaveBeenCalledWith(userId, dto);
    });

    it('should handle partial updates', async () => {
      const userId = 1;
      const dto: EditUserDto = { firstName: 'UpdatedName' };

      await userController.editUser(userId, dto);

      expect(userService.editUser).toHaveBeenCalledWith(userId, dto);
    });

    it('should forward the service response', async () => {
      const userId = 1;
      const dto: EditUserDto = { email: 'test@example.com' };
      const expectedResponse = { id: userId, ...dto };

      (userService.editUser as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await userController.editUser(userId, dto);

      expect(result).toEqual(expectedResponse);
    });
  });
});
