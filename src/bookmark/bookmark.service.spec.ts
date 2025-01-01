import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from './bookmark.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto';
import { BookmarkNotFoundException } from '../common/exceptions';

describe('BookmarkService', () => {
  let bookmarkService: BookmarkService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarkService,
        {
          provide: PrismaService,
          useValue: {
            bookmark: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    bookmarkService = module.get<BookmarkService>(BookmarkService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createBookmark', () => {
    it('should create a bookmark with valid user ID and DTO', async () => {
      const userId = 1;
      const dto: CreateBookmarkDto = {
        title: 'Test Bookmark',
        description: 'Test Description',
        link: 'https://test.com',
      };

      const expectedBookmark = {
        id: 1,
        userId,
        title: dto.title,
        description: dto.description || null,
        link: dto.link,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.bookmark, 'create')
        .mockResolvedValue(expectedBookmark);

      const result = await bookmarkService.createBookmark(userId, dto);

      expect(prismaService.bookmark.create).toHaveBeenCalledWith({
        data: {
          userId,
          ...dto,
        },
        include: {
          user: true,
        },
      });
      expect(result).toEqual(expectedBookmark);
    });

    it('should throw an error if prisma create fails', async () => {
      const userId = 1;
      const dto: CreateBookmarkDto = {
        title: 'Test Bookmark',
        description: 'Test Description',
        link: 'https://test.com',
      };

      jest
        .spyOn(prismaService.bookmark, 'create')
        .mockRejectedValue(new Error('Database error'));

      await expect(bookmarkService.createBookmark(userId, dto)).rejects.toThrow(
        'Database error',
      );
    });

    it('should create a bookmark with minimal DTO fields', async () => {
      const userId = 1;
      const dto: CreateBookmarkDto = {
        title: 'Test Bookmark',
        link: 'https://test.com',
      };

      const expectedBookmark = {
        id: 1,
        userId,
        ...dto,
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: userId,
          email: 'test@example.com',
        },
      };

      jest
        .spyOn(prismaService.bookmark, 'create')
        .mockResolvedValue(expectedBookmark);

      const result = await bookmarkService.createBookmark(userId, dto);

      expect(prismaService.bookmark.create).toHaveBeenCalledWith({
        data: {
          userId,
          ...dto,
        },
        include: {
          user: true,
        },
      });
      expect(result).toEqual(expectedBookmark);
    });
  });

  describe('getBookmarks', () => {
    it('should return all bookmarks for a user', async () => {
      const userId = 1;
      const expectedBookmarks = [
        {
          id: 1,
          userId,
          title: 'Bookmark 1',
          description: 'Description 1',
          link: 'https://test1.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          userId,
          title: 'Bookmark 2',
          description: 'Description 2',
          link: 'https://test2.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest
        .spyOn(prismaService.bookmark, 'findMany')
        .mockResolvedValue(expectedBookmarks);

      const result = await bookmarkService.getBookmarks(userId);
      expect(result).toEqual(expectedBookmarks);
    });
  });

  describe('getBookmarkById', () => {
    it('should return a bookmark when found', async () => {
      const userId = 1;
      const bookmarkId = 1;
      const expectedBookmark = {
        id: bookmarkId,
        userId,
        title: 'Test Bookmark',
        description: 'Test Description',
        link: 'https://test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.bookmark, 'findUnique')
        .mockResolvedValue(expectedBookmark);

      const result = await bookmarkService.getBookmarkById(userId, bookmarkId);
      expect(result).toEqual(expectedBookmark);
    });

    it('should throw BookmarkNotFoundException when bookmark not found', async () => {
      const userId = 1;
      const bookmarkId = 999;

      jest.spyOn(prismaService.bookmark, 'findUnique').mockResolvedValue(null);

      await expect(
        bookmarkService.getBookmarkById(userId, bookmarkId),
      ).rejects.toThrow(BookmarkNotFoundException);
    });
  });

  describe('updateBookmarkById', () => {
    it('should update and return the bookmark', async () => {
      const userId = 1;
      const bookmarkId = 1;
      const dto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      const existingBookmark = {
        id: bookmarkId,
        userId,
        title: 'Old Title',
        description: 'Old Description',
        link: 'https://test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedBookmark = {
        ...existingBookmark,
        ...dto,
      };

      jest
        .spyOn(prismaService.bookmark, 'findUnique')
        .mockResolvedValue(existingBookmark);
      jest
        .spyOn(prismaService.bookmark, 'update')
        .mockResolvedValue(updatedBookmark);

      const result = await bookmarkService.updateBookmarkById(
        userId,
        bookmarkId,
        dto,
      );
      expect(result).toEqual(updatedBookmark);
    });
  });

  describe('deleteBookmarkById', () => {
    it('should delete and return the bookmark', async () => {
      const userId = 1;
      const bookmarkId = 1;
      const deletedBookmark = {
        id: bookmarkId,
        userId,
        title: 'To Delete',
        description: 'Will be deleted',
        link: 'https://test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.bookmark, 'findUnique')
        .mockResolvedValue(deletedBookmark);
      jest
        .spyOn(prismaService.bookmark, 'delete')
        .mockResolvedValue(deletedBookmark);

      const result = await bookmarkService.deleteBookmarkById(
        userId,
        bookmarkId,
      );
      expect(result).toEqual(deletedBookmark);
    });

    it('should throw BookmarkNotFoundException when trying to delete non-existent bookmark', async () => {
      const userId = 1;
      const bookmarkId = 999;

      jest.spyOn(prismaService.bookmark, 'findUnique').mockResolvedValue(null);

      await expect(
        bookmarkService.deleteBookmarkById(userId, bookmarkId),
      ).rejects.toThrow(BookmarkNotFoundException);
    });
  });
});
