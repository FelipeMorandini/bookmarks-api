import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkModule } from './bookmark.module';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

describe('BookmarkModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        BookmarkModule,
        ConfigModule.forRoot({
          isGlobal: true
        })
      ],
      providers: [
        {
          provide: PrismaService,
          useFactory: () => ({
            bookmark: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            }
          })
        }
      ]
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide BookmarkService', () => {
    const service = module.get<BookmarkService>(BookmarkService);
    expect(service).toBeDefined();
  });

  it('should provide BookmarkController', () => {
    const controller = module.get<BookmarkController>(BookmarkController);
    expect(controller).toBeDefined();
  });
});
