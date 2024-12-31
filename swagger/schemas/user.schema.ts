export const UserResponseSchema = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  },
};

export const EditUserResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const UserErrorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string', example: 'Bad Request' },
    statusCode: { type: 'number', example: 400 },
    message: {
      type: 'string',
      optional: true,
      example:
        "Expected property name or '}' in JSON at position 1 (line 1 column 2)",
    },
  },
};
