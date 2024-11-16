import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              switch (key) {
                case 'JWT_SECRET':
                  return 'test-secret';
                default:
                  return null;
              }
            },
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('validate', () => {
    it('should return user without password when user exists', async () => {
      const createdDate = new Date();
      const updatedDate = new Date();
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: createdDate,
        updatedAt: updatedDate,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const payload = { sub: 1, email: 'test@example.com' };
      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: createdDate,
        updatedAt: updatedDate,
      });
      expect(result.password).toBeUndefined();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: payload.sub },
      });
    });

    it('should return null when user does not exist', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const payload = { sub: 999, email: 'nonexistent@example.com' };
      const result = await strategy.validate(payload);

      expect(result).toBeNull();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: payload.sub },
      });
    });

    it('should handle database errors gracefully', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockRejectedValue(new Error('Database error'));

      const payload = { sub: 1, email: 'test@example.com' };
      await expect(strategy.validate(payload)).rejects.toThrow();
    });
  });
});
