import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * BookmarkModule is responsible for handling the dependency injection and organization
 * of components related to the bookmark functionality of the application.
 *
 * This module imports the PrismaModule to enable database access and operations.
 * It provides the BookmarkService for handling business logic related to bookmarks.
 * It also registers the BookmarkController to expose API endpoints for bookmark operations.
 */
@Module({
  imports: [PrismaModule],
  providers: [BookmarkService],
  controllers: [BookmarkController],
})
export class BookmarkModule {}
