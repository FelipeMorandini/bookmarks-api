import { Injectable, Logger } from '@nestjs/common';

/**
 * LoggerService is a custom service that extends the Logger class to provide
 * standardized logging functionality with additional metadata, such as timestamp.
 *
 * Methods:
 * - error: Logs error messages along with stack trace and optional context.
 * - warn: Logs warning messages with optional context.
 * - log: Logs informational messages with optional context.
 *
 * This service enhances the default logging behavior by including a timestamp
 * for each log entry.
 */
@Injectable()
export class LoggerService extends Logger {
  /**
   * Logs an error message along with its trace and optional context.
   *
   * @param {string} message - The error message to log.
   * @param {string} trace - The trace or stack information related to the error.
   * @param {string} [context] - Optional context or additional information about the error.
   * @return {void} This method does not return any value.
   */
  error(message: string, trace: string, context?: string): void {
    super.error({
      message,
      trace,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Logs a warning message with an optional context and a timestamp.
   *
   * @param {string} message - The warning message to log.
   * @param {string} [context] - Optional string providing additional context for the warning.
   * @return {void} - Does not return a value.
   */
  warn(message: string, context?: string): void {
    super.warn({
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Logs a message along with an optional context and a timestamp.
   *
   * @param {string} message - The message to be logged.
   * @param {string} [context] - An optional string representing the context of the log.
   * @return {void} This method does not return anything.
   */
  log(message: string, context?: string): void {
    super.log({
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}
