import { NotFoundException } from '@nestjs/common';

/**
 * Exception thrown when a user cannot be found in the system.
 *
 * This exception is a specialized version of `NotFoundException` and is used
 * to indicate that the requested user, identified by a specific user ID, does
 * not exist or could not be located.
 *
 * The constructor accepts the user's unique identifier and provides a detailed
 * error message indicating which user ID was not found.
 *
 * Extends the base `NotFoundException` to represent user-specific not found errors.
 */
export class UserNotFoundException extends NotFoundException {
  constructor(userId: number) {
    super(`User with ID ${userId} not found`);
  }
}
