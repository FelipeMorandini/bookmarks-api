import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto, AuthDto } from './dto';
import { ForbiddenException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            signin: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should call authService.signup with correct parameters', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      await authController.signup(signUpDto);

      expect(authService.signup).toHaveBeenCalledWith(signUpDto);
    });

    it('should throw ForbiddenException if email already exists', async () => {
      const signUpDto: SignUpDto = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      jest
        .spyOn(authService, 'signup')
        .mockRejectedValue(new ForbiddenException('Email already exists'));

      await expect(authController.signup(signUpDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('signin', () => {
    it('should call authService.login with correct parameters', async () => {
      const signInDto: AuthDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await authController.signin(signInDto);

      expect(authService.signin).toHaveBeenCalledWith(signInDto);
    });

    it('should throw ForbiddenException if credentials are incorrect', async () => {
      const signInDto: AuthDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      jest
        .spyOn(authService, 'signin' as keyof AuthService)
        .mockRejectedValue(
          new ForbiddenException('Email or password is incorrect'),
        );

      await expect(authController.signin(signInDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
