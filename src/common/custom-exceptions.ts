import { NotFoundException } from '@nestjs/common';

export class BookmarkNotFoundException extends NotFoundException {
  constructor(bookmarkId: number) {
    super(`Bookmark with ID ${bookmarkId} not found`);
  }
}
