import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * JwtStrategy is a class responsible for implementing the Passport JWT authentication strategy.
 * It validates JWT tokens and resolves the authenticated user from the database.
 * This strategy uses the JSON Web Token (JWT) authentication scheme with a Bearer token.
 * It requires configuration values such as the JWT secret to be supplied via a ConfigService.
 * Interaction with the database to fetch user details is handled using the PrismaService.
 *
 * Constructor:
 * - Initializes the strategy with options related to the extraction of the JWT and the secret key.
 * - Expects ConfigService and PrismaService as dependencies injected via the constructor.
 *
 * Methods:
 * - validate(payload): Validates the JWT payload and retrieves the corresponding user from the database.
 *   If the user exists, the password is removed from the returned object to ensure security.
 *   If the user does not exist, it returns null.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!user) {
      return null;
    }
    delete user.password;
    return user;
  }
}
