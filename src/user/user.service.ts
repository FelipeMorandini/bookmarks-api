import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { User } from '@prisma/client';

/**
 * Service responsible for managing user-related operations.
 */
@Injectable()
export class UserService {
  /**
   * Initializes a new instance of the class.
   *
   * @param {PrismaService} prisma - The Prisma service instance used for database interactions.
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Updates a user's data based on the userId and the provided EditUserDto.
   *
   * @param {number} userId - The unique identifier of the user to be edited.
   * @param {EditUserDto} dto - An object containing the data to update the user with.
   * @return {Promise<Object>} A promise that resolves to the updated user object without the password field.
   */
  async editUser(userId: number, dto: EditUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    delete user.password;

    return user;
  }
  catch(error: Error, userId: number) {
    throw new NotFoundException(`User with ID ${userId} not found`);
  }
}
