import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * The UserModule is a feature module in the application designed to manage
 * and encapsulate the functionality related to user operations.
 *
 * This module imports the PrismaModule to handle database interactions.
 * It declares the UserController to manage HTTP request handling
 * and routes related to user operations.
 *
 * The UserService is provided within the module to manage user-related
 * business logic and data services.
 */
@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
