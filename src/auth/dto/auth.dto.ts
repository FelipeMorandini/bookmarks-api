import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * A Data Transfer Object (DTO) for authentication functionality.
 * This class is used to define the structure of data required
 * during the authentication process, enforcing specific validation
 * rules for its properties.
 */
export class AuthDto {
  @ApiProperty({ description: 'User email', example: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
