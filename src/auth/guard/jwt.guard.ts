import { AuthGuard } from '@nestjs/passport';

/**
 * JwtGuard is a class that extends the AuthGuard class with the 'jwt' strategy.
 * It is used to protect routes by verifying and enforcing valid JWT authentication for requests.
 *
 * This guard ensures that the incoming request contains a valid JSON Web Token (JWT),
 * which is typically used for authentication and authorization purposes.
 *
 * The constructor initializes the guard by calling the parent class constructor
 * with the 'jwt' strategy as a parameter.
 *
 * This class is commonly used in NestJS applications to secure endpoints
 * and ensure that only authenticated users can access certain resources.
 */
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
