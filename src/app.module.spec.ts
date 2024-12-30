import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

describe('AppModule', () => {
  let appModule: TestingModule;

  beforeEach(async () => {
    appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(appModule).toBeDefined();
  });

  it('should import AuthModule', () => {
    const authModule = appModule.get<AuthModule>(AuthModule);
    expect(authModule).toBeDefined();
  });

  it('should import UserModule', () => {
    const userModule = appModule.get<UserModule>(UserModule);
    expect(userModule).toBeDefined();
  });

  it('should import BookmarkModule', () => {
    const bookmarkModule = appModule.get<BookmarkModule>(BookmarkModule);
    expect(bookmarkModule).toBeDefined();
  });

  it('should import PrismaModule', () => {
    const prismaModule = appModule.get<PrismaModule>(PrismaModule);
    expect(prismaModule).toBeDefined();
  });

  it('should import ConfigModule', () => {
    const configModule = appModule.get<ConfigModule>(ConfigModule);
    expect(configModule).toBeDefined();
  });
});
