import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * The SignUpDto class is a data transfer object used for handling user sign-up requests.
 * It enforces validation and serialization rules for the associated properties.
 *
 * The class includes the following properties:
 * - `email`: A non-empty, valid email address of the user.
 * - `password`: A non-empty string serving as the user's password.
 * - `firstName`: A non-empty string representing the user's first name.
 * - `lastName`: A non-empty string representing the user's last name.
 *
 * Decorators from libraries such as `class-validator` and `nestjs/swagger` are used to ensure proper validation
 * and to generate OpenAPI documentation for the class.
 */
export class SignUpDto {
  @ApiProperty({ description: 'User email', example: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
