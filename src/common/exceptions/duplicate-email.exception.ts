import { ConflictException } from '@nestjs/common';

/**
 * Exception thrown when attempting to register an email address that is already registered.
 *
 * DuplicateEmailException extends the ConflictException class, indicating
 * a conflict has occurred due to a duplicate email entry.
 *
 * The exception message includes the email address that is causing the conflict.
 *
 * @extends ConflictException
 * @param {string} email - The email address that is already registered.
 */
export class DuplicateEmailException extends ConflictException {
  constructor(email: string) {
    super(`Email ${email} is already registered`);
  }
}
