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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  BookmarkErrorSchema,
  BookmarkRequestSchema,
  BookmarkResponseSchema,
  BookmarksArrayResponseSchema,
} from '../../swagger';

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

  /**
   * Retrieves all bookmarks created by the current user.
   *
   * @param {number} userId - The unique identifier of the current user.
   * @return {Promise<Object[]>} A promise that resolves to an array of bookmark objects created by the user.
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all bookmarks',
    description: 'Get all bookmarks created by the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookmarks retrieved',
    type: [Object],
    schema: BookmarksArrayResponseSchema,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Get()
  getBookmarks(@GetUser('id') userId: number): Promise<object[]> {
    return this.bookmarkService.getBookmarks(userId);
  }

  /**
   * Retrieves a bookmark by its unique identifier.
   *
   * @param {number} userId - The ID of the user making the request.
   * @param {number} bookmarkId - The ID of the bookmark to retrieve.
   *
   * @return {Object} The retrieved bookmark object.
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get bookmark by id',
    description: 'Get a bookmark by its unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookmark retrieved',
    type: Object,
    schema: BookmarkResponseSchema,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Bookmark not found',
  })
  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ): object {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  /**
   * Creates a new bookmark for the authenticated user.
   *
   * @param {number} userId - The ID of the authenticated user.
   * @param {CreateBookmarkDto} dto - The data transfer object containing bookmark details.
   * @return {Promise<Object>} A promise that resolves to the newly created bookmark object.
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create bookmark',
    description: 'Create a new bookmark',
  })
  @ApiBody({ schema: BookmarkRequestSchema })
  @ApiResponse({
    status: 201,
    description: 'Bookmark created',
    type: Object,
    schema: BookmarkResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: BookmarkErrorSchema,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Post()
  createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ): Promise<object> {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  /**
   * Updates a bookmark identified by its unique ID.
   *
   * @param {number} userId - The ID of the user making the request.
   * @param {number} bookmarkId - The unique identifier of the bookmark to update.
   * @param {EditBookmarkDto} dto - The data transfer object containing updated bookmark details.
   * @return {Object} The updated bookmark object if successful.
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update bookmark by id',
    description: 'Update a bookmark by its unique identifier',
  })
  @ApiQuery({ name: 'id', required: true, type: Number })
  @ApiBody({ schema: BookmarkRequestSchema })
  @ApiResponse({
    status: 200,
    description: 'Bookmark updated',
    type: Object,
    schema: BookmarkResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: BookmarkErrorSchema,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Bookmark not found',
  })
  @Patch(':id')
  updateBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto,
  ): object {
    return this.bookmarkService.updateBookmarkById(userId, bookmarkId, dto);
  }

  /**
   * Deletes a bookmark by its unique identifier.
   *
   * @param {number} userId - The ID of the user requesting the deletion.
   * @param {number} bookmarkId - The ID of the bookmark to be deleted.
   * @return {Object} A response object indicating the result of the operation.
   *                  If successful, contains confirmation of deletion.
   *                  If the bookmark is not found, returns an appropriate error message.
   *                  If the user is unauthorized, returns an unauthorized error message.
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete bookmark by id',
    description: 'Delete a bookmark by its unique identifier',
  })
  @ApiQuery({ name: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Bookmark deleted',
    type: Object,
    schema: BookmarkResponseSchema,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Bookmark not found',
  })
  @Delete(':id')
  deleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ): object {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
