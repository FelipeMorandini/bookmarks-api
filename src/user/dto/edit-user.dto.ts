import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO (Data Transfer Object) used for editing user information.
 * Contains optional properties that can be updated for a user.
 *
 * Properties:
 * - email: Represents the user's email address. It must be a valid email format if provided.
 * - firstName: Represents the user's first name. Must be a string if provided.
 * - lastName: Represents the user's last name. Must be a string if provided.
 */
export class EditUserDto {
  @ApiProperty({ description: 'User email', example: 'test@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;
}
