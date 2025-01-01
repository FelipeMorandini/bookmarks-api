import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

/**
 * LoggerModule is a global module designed for managing and providing logging functionality
 * throughout the application. It encapsulates the LoggerService, making it available
 * application-wide as a shared service.
 *
 * This module is marked as global to ensure that the logging functionality does not
 * need to be imported multiple times across different modules. It provides centralized
 * and consistent log handling for the application.
 *
 * The LoggerService within this module can be used to log messages, errors, and other
 * necessary information related to the application's state and behavior.
 */
@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
