import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignUpDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  AuthErrorSchema,
  AuthResponseSchema,
  SignInRequestSchema,
  SignUpRequestSchema,
} from '../../swagger';

/**
 * Controller responsible for handling authentication-related operations such as user signup and signin.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  /**
   * Creates an instance of the class.
   *
   * @param {AuthService} authService - The authentication service instance to handle authentication-related operations.
   */
  constructor(private authService: AuthService) {}

  /**
   * Handles the user signup process by creating a new user account and returning an authentication response.
   *
   * @param {SignUpDto} dto - The data transfer object containing user signup information.
   * @return {Promise<AuthResponseSchema>} A promise resolving to the authentication response schema if the signup is successful.
   */
  @ApiOperation({
    summary: 'Sign up',
    description:
      'Create a new user account and return an authentication response.',
  })
  @ApiBody({ schema: SignUpRequestSchema })
  @ApiResponse({
    status: 201,
    description: 'User created',
    schema: AuthResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: AuthErrorSchema,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: AuthErrorSchema,
  })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignUpDto): Promise<{ access_token: string }> {
    return await this.authService.signup(dto);
  }

  /**
   * Authenticates a user using the provided credentials.
   *
   * @param {AuthDto} dto - The data transfer object containing user authentication details.
   * @return {Promise<AuthResponseSchema>} A promise that resolves with the authentication response schema if the user is successfully authenticated.
   */
  @ApiOperation({
    summary: 'Sign up',
    description: 'Authenticate a user using the provided credentials.',
  })
  @ApiBody({ schema: SignInRequestSchema })
  @ApiResponse({
    status: 200,
    description: 'User Authenticated',
    schema: AuthResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: AuthErrorSchema,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: AuthErrorSchema,
  })
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthDto): Promise<{ access_token: string }> {
    return await this.authService.signin(dto);
  }
}
