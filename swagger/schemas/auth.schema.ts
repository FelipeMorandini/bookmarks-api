export const SignUpRequestSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', format: 'password' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
  },
  required: ['email', 'password', 'firstName', 'lastName'],
};

export const SignInRequestSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', format: 'password' },
  },
  required: ['email', 'password'],
};

export const AuthResponseSchema = {
  type: 'object',
  properties: {
    access_token: {
      type: 'string',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  },
};

export const AuthErrorSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    message: { type: 'string' },
    error: { type: 'string' },
  },
  examples: {
    badRequest: {
      value: {
        statusCode: 400,
        message: [
          'firstName should not be empty',
          'firstName must be a string',
        ],
        error: 'Bad Request',
      },
    },
    forbidden: {
      value: {
        statusCode: 403,
        message: 'Email already exists',
        error: 'Forbidden',
      },
    },
    invalidCredentials: {
      value: {
        statusCode: 403,
        message: 'Email or password is incorrect',
        error: 'Forbidden',
      },
    },
  },
};
