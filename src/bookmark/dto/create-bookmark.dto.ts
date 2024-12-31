import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO (Data Transfer Object) class for creating a new bookmark.
 * This class defines the required and optional fields necessary
 * for generating a new bookmark entry with appropriate validations.
 *
 * Fields:
 * - title: The title of the bookmark. Must be a non-empty string.
 * - description: An optional description for the bookmark. Must be a string if provided.
 * - link: The URL or link for the bookmark. Must be a non-empty string.
 */
export class CreateBookmarkDto {
  @ApiProperty({ description: 'Bookmark title', example: 'My Bookmark' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Bookmark description',
    example: 'This is a sample bookmark description.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Bookmark link',
    example: 'https://example.com/bookmark',
  })
  @IsString()
  @IsNotEmpty()
  link: string;
}
