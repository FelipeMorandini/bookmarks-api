import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

/**
 * Represents the root application module in a NestJS application.
 *
 * AppModule is decorated with the @Module decorator and is used to
 * configure the application's primary dependencies. It serves as a container
 * for various imported sub-modules, ensuring modular and maintainable architecture.
 *
 * The following modules are imported:
 * - AuthModule: Handles user authentication and authorization.
 * - ConfigModule: Provides configuration management for the application.
 *   ConfigModule is configured as a global module, making its configuration accessible across the entire application.
 * - UserModule: Manages user-related operations and functionalities.
 * - BookmarkModule: Handles operations related to managing bookmarks.
 * - PrismaModule: Facilitates database interactions through Prisma ORM.
 */
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    BookmarkModule,
    PrismaModule,
  ],
})
export class AppModule {}
