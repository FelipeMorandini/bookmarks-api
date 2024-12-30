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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up' })
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
  async signup(@Body() dto: SignUpDto) {
    return await this.authService.signup(dto);
  }

  @ApiOperation({ summary: 'Sign up' })
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
  async signin(@Body() dto: AuthDto) {
    return await this.authService.signin(dto);
  }
}
