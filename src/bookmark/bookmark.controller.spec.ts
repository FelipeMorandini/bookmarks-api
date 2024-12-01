import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { JwtGuard } from '../auth/guard';

describe('BookmarkController', () => {
  let controller: BookmarkController;
  let bookmarkService: BookmarkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarkController],
      providers: [
        {
          provide: BookmarkService,
          useValue: {
            getBookmarks: jest.fn(),
            getBookmarkById: jest.fn(),
            createBookmark: jest.fn(),
            updateBookmarkById: jest.fn(),
            deleteBookmarkById: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BookmarkController>(BookmarkController);
    bookmarkService = module.get<BookmarkService>(BookmarkService);
  });

  describe('getBookmarks', () => {
    it('should call bookmarkService.getBookmarks with userId', async () => {
      const userId = 1;
      const expectedBookmarks = [
        {
          id: 1,
          title: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
          description: 'Test description',
          link: 'https://test.com',
          userId: userId,
        },
      ];
      jest
        .spyOn(bookmarkService, 'getBookmarks')
        .mockResolvedValue(expectedBookmarks);

      const result = await controller.getBookmarks(userId);

      expect(bookmarkService.getBookmarks).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedBookmarks);
    });
  });

  describe('getBookmarkById', () => {
    it('should call bookmarkService.getBookmarkById with correct parameters', async () => {
      const userId = 1;
      const bookmarkId = 2;
      const expectedBookmark = {
        id: bookmarkId,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: 'Test',
        description: 'Test description',
        link: 'https://test.com',
        userId: userId,
      };
      jest
        .spyOn(bookmarkService, 'getBookmarkById')
        .mockResolvedValue(expectedBookmark);

      const result = await controller.getBookmarkById(userId, bookmarkId);

      expect(bookmarkService.getBookmarkById).toHaveBeenCalledWith(
        userId,
        bookmarkId,
      );
      expect(result).toEqual(expectedBookmark);
    });
  });

  describe('createBookmark', () => {
    it('should call bookmarkService.createBookmark with userId and dto', async () => {
      const userId = 1;
      const dto: CreateBookmarkDto = {
        title: 'New Bookmark',
        link: 'https://test.com',
      };
      const expectedBookmark = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: 'Test',
        description: 'Test description',
        link: 'https://test.com',
        userId: userId,
        user: {
          id: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          email: 'test@example.com',
          password: 'hashedpassword',
          firstName: 'John',
          lastName: 'Doe'
        }
      };
      jest
        .spyOn(bookmarkService, 'createBookmark')
        .mockResolvedValue(expectedBookmark);

      const result = await controller.createBookmark(userId, dto);

      expect(bookmarkService.createBookmark).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual(expectedBookmark);
    });
  });

  describe('updateBookmarkById', () => {
    it('should call bookmarkService.updateBookmarkById with correct parameters', async () => {
      const userId = 1;
      const bookmarkId = 2;
      const dto: EditBookmarkDto = {
        title: 'Updated Title',
      };
      const expectedBookmark = {
        id: bookmarkId,
        title: dto.title,
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        link: 'https://test.com',
        userId: userId,
      };
      jest
        .spyOn(bookmarkService, 'updateBookmarkById')
        .mockResolvedValue(expectedBookmark);

      const result = await controller.updateBookmarkById(
        userId,
        bookmarkId,
        dto,
      );

      expect(bookmarkService.updateBookmarkById).toHaveBeenCalledWith(
        userId,
        bookmarkId,
        dto,
      );
      expect(result).toEqual(expectedBookmark);
    });
  });

  describe('deleteBookmarkById', () => {
    it('should call bookmarkService.deleteBookmarkById with correct parameters', async () => {
      const userId = 1;
      const bookmarkId = 2;
      const expectedBookmark = {
        id: bookmarkId,
        title: 'Deleted',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        link: 'https://test.com',
        userId: userId,
      };
      jest
        .spyOn(bookmarkService, 'deleteBookmarkById')
        .mockResolvedValue(expectedBookmark);

      const result = await controller.deleteBookmarkById(userId, bookmarkId);

      expect(bookmarkService.deleteBookmarkById).toHaveBeenCalledWith(
        userId,
        bookmarkId,
      );
      expect(result).toEqual(expectedBookmark);
    });
  });
});
