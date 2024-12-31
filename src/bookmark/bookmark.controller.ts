import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { ApiBearerAuth } from '@nestjs/swagger';

/**
 * The BookmarkController handles all operations related to bookmarks.
 * It provides endpoints for creating, reading, updating, and deleting bookmarks.
 * All routes are protected and require valid user authentication through the JwtGuard.
 */
@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  /**
   * Constructs an instance of the class and initializes it with the provided BookmarkService.
   *
   * @param {BookmarkService} bookmarkService - The service used for managing bookmarks.
   */
  constructor(private bookmarkService: BookmarkService) {}

  @ApiBearerAuth()
  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @ApiBearerAuth()
  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @ApiBearerAuth()
  @Post()
  createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  updateBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmarkService.updateBookmarkById(userId, bookmarkId, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  deleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
