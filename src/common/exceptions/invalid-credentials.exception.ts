import { UnauthorizedException } from '@nestjs/common';

/**
 * Represents an exception thrown when user authentication fails due to invalid credentials.
 * This error typically occurs when the provided email or password does not match
 * the records in the authentication system.
 *
 * Extends the `UnauthorizedException` class to indicate that the HTTP request
 * cannot be completed due to authentication issues.
 */
export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('Invalid email or password');
  }
}
