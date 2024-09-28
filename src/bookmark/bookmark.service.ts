import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { BookmarkNotFoundException } from '../common/custom-exceptions';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
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

  async getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
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

  async updateBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
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

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    await this.getBookmarkById(userId, bookmarkId);
    return this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }
}
