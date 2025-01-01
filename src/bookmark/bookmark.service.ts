import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { BookmarkNotFoundException } from '../common/exceptions';

/**
 * Provides services related to managing bookmarks, including creation, retrieval, update, and deletion.
 */
@Injectable()
export class BookmarkService {
  /**
   * Initializes a new instance of the class with the provided PrismaService.
   *
   * @param {PrismaService} prisma - The PrismaService instance used to interact with the database.
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new bookmark for the specified user with the provided data.
   *
   * @param {number} userId - The ID of the user for whom the bookmark is being created.
   * @param {CreateBookmarkDto} dto - The data transfer object containing details of the bookmark to be created.
   * @return {Promise<object>} Returns a promise that resolves to the created bookmark object, including the associated user information.
   */
  async createBookmark(
    userId: number,
    dto: CreateBookmarkDto,
  ): Promise<object> {
    return this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
      include: {
        user: true,
      },
    });
  }

  /**
   * Fetches all bookmarks associated with a specific user.
   *
   * @param {number} userId - The unique identifier of the user whose bookmarks are being retrieved.
   * @return {Promise<Array>} A promise that resolves to an array of bookmark objects belonging to the specified user.
   */
  async getBookmarks(userId: number): Promise<Array<any>> {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  /**
   * Retrieves a bookmark by its ID for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the bookmark.
   * @param {number} bookmarkId - The ID of the bookmark to retrieve.
   * @return {Promise<Object>} A promise that resolves to the bookmark object if found.
   * @throws {BookmarkNotFoundException} If the bookmark with the specified ID is not found.
   */
  async getBookmarkById(userId: number, bookmarkId: number): Promise<object> {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
        userId,
      },
    });
    if (!bookmark) {
      throw new BookmarkNotFoundException(bookmarkId);
    }
    return bookmark;
  }

  /**
   * Updates a specific bookmark for a given user by its ID.
   *
   * @param {number} userId - The ID of the user to whom the bookmark belongs.
   * @param {number} bookmarkId - The ID of the bookmark to be updated.
   * @param {EditBookmarkDto} dto - The data transfer object containing updated bookmark details.
   * @return {Promise<Object>} A promise resolving to the updated bookmark object.
   */
  async updateBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ): Promise<object> {
    await this.getBookmarkById(userId, bookmarkId);
    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
        userId,
      },
      data: {
        ...dto,
      },
    });
  }

  /**
   * Deletes a bookmark by its unique identifier and associated user ID.
   *
   * @param {number} userId - The ID of the user who owns the bookmark.
   * @param {number} bookmarkId - The unique identifier of the bookmark to be deleted.
   * @return {Promise<Object>} Returns a promise that resolves to the deleted bookmark object.
   */
  async deleteBookmarkById(
    userId: number,
    bookmarkId: number,
  ): Promise<object> {
    await this.getBookmarkById(userId, bookmarkId);
    return this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }
}
