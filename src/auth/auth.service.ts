import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * AuthService is responsible for managing user authentication and authorization.
 * It provides methods for user signup, signin, and token generation.
 */
@Injectable({})
export class AuthService {
  /**
   * Constructs an instance of the class.
   *
   * @param {PrismaService} prisma - The service used for database operations.
   * @param {JwtService} jwt - The service used for handling JSON Web Tokens.
   * @param {ConfigService} config - The service used for configuration management.
   */
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  /**
   * Handles user signup by creating a new user in the database and returning an authentication token.
   *
   * @param {SignUpDto} dto The data transfer object containing user signup information such as email, password, firstName, and lastName.
   * @return {Promise<string>} A promise that resolves to the authentication token for the newly created user.
   * @throws {ForbiddenException} If the email provided in the signup request already exists in the database.
   * @throws {Error} For any other unhandled errors occurring during the signup process.
   */
  async signup(dto: SignUpDto): Promise<{ access_token: string }> {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  /**
   * Signs in a user by verifying their email and password.
   *
   * @param {AuthDto} dto - An object containing the user's email and password.
   * @return {Promise<string>} A promise that resolves to a signed token for the authenticated user.
   * @throws {ForbiddenException} If the email or password is incorrect.
   */
  async signin(dto: AuthDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Email or password is incorrect');
    }

    const pwMatches = await argon.verify(user.password, dto.password);

    if (!pwMatches) {
      throw new ForbiddenException('Email or password is incorrect');
    }

    return this.signToken(user.id, user.email);
  }

  /**
   * Generates a signed JSON Web Token (JWT) for a user based on their unique identifier and email.
   *
   * @param {number} userId - The unique identifier of the user.
   * @param {string} email - The email address of the user.
   * @return {Promise<{ access_token: string }>} A promise that resolves with an object containing the signed access token.
   */
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
