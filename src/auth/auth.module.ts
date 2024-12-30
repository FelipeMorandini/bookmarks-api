import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';

/**
 * The AuthModule is responsible for handling authentication in the application.
 * It integrates the JwtModule for JSON Web Token functionalities and sets up
 * the necessary controllers and providers required for authentication processes.
 *
 * This module includes:
 * - JwtModule: Configured to manage JWT-based authentication.
 * - AuthController: Defines endpoints for authentication-related operations.
 * - AuthService: Handles business logic related to authentication.
 * - JwtStrategy: Provides the strategy for validating and processing JWT tokens.
 */
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
