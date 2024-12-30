import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * A parameter decorator used to extract the `user` object
 * or a specific property of the `user` object from the
 * request object in the execution context.
 *
 * This decorator retrieves the `user` data from the HTTP
 * request, which is typically set after authentication middleware.
 *
 * @param {string | undefined} data - An optional string indicating
 * the specific property of the `user` object to extract. If not
 * provided, the entire `user` object will be returned.
 * @param {ExecutionContext} ctx - The execution context representing
 * the current state of the application, used to access the underlying
 * request object.
 *
 * @returns {*} - The `user` object or a specific property from the
 * `user` object, based on the provided `data` argument.
 */
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
