import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * An interceptor that handles errors occurring during the execution of a request.
 * Logs error details such as message, stack trace, timestamp, and request path.
 * Ensures error handling is centralized and consistent across the application.
 * Implements NestInterceptor interface.
 */
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger('ErrorInterceptor');

  /**
   * Intercepts the execution context to handle errors and log error details.
   *
   * @param {ExecutionContext} context - The current execution context.
   * @param {CallHandler} next - The handler to process the current execution.
   * @return {Observable<any>} An observable stream that processes the handler's output or handles errors.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        this.logger.error({
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          path: context.switchToHttp().getRequest().url,
        });
        return throwError(() => error);
      }),
    );
  }
}
