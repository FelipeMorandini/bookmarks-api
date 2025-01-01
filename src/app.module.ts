import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';

/**
 * AppModule serves as the root module of the application, configuring and assembling all required
 * modules, services, and dependencies. It defines the core structure and dependencies for the application.
 *
 * The module imports various essential submodules, such as:
 * - LoggerModule for application-wide logging.
 * - AuthModule for handling authentication and authorization logic.
 * - ConfigModule, configured as global, for managing application settings and environment variables.
 * - UserModule to manage user-related operations.
 * - BookmarkModule to handle bookmarking functionalities.
 * - PrismaModule for interacting with the database via Prisma ORM.
 *
 * This module integrates these components to provide a cohesive organization of application features.
 */
@Module({
  imports: [
    LoggerModule,
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
