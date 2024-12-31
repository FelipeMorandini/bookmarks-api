import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserErrorSchema, UserResponseSchema } from '../../swagger';

/**
 * UserController is responsible for handling requests related to user operations.
 * It provides endpoints for retrieving and updating user details.
 */
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  /**
   * Creates an instance of the class.
   *
   * @param {UserService} userService - An instance of the UserService for managing user-related operations.
   */
  constructor(private userService: UserService) {}

  /**
   * Retrieves details of the authenticated user.
   *
   * @param {User} user - The authenticated user object.
   * @return {Object} An object containing the user's details without the password.
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user details',
    description: 'Retrieve details of the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User details retrieved',
    schema: UserResponseSchema,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Get('me')
  getMe(@GetUser() user: User): object {
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...userWithoutPassword } = user;
      return { user: userWithoutPassword };
    }
    return { user };
  }

  /**
   * Updates the details of the authenticated user.
   *
   * @param {number} userId - The unique identifier of the user.
   * @param {EditUserDto} dto - The data transfer object containing the updated user details.
   * @return {Promise<UserResponseSchema>} A promise resolving to the updated user details or an error response.
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user details',
    description: 'Update the details of the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User details updated',
    schema: UserResponseSchema,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: UserErrorSchema,
  })
  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ): Promise<User> {
    return this.userService.editUser(userId, dto);
  }
}
