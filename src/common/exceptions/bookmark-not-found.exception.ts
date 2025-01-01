import { NotFoundException } from '@nestjs/common';

/**
 * Exception thrown when a bookmark with a specific ID cannot be found.
 *
 * This class extends the NotFoundException and is typically used to indicate
 * that a requested bookmark, identified by its unique ID, does not exist in
 * the data store or inventory.
 *
 * The message provides additional context by including the ID of the missing
 * bookmark.
 */
export class BookmarkNotFoundException extends NotFoundException {
  constructor(bookmarkId: number) {
    super(`Bookmark with ID ${bookmarkId} not found`);
  }
}
