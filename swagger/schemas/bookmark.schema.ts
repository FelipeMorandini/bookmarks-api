export const BookmarkResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    description: { type: 'string' },
    link: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    userId: { type: 'number' },
  },
};

export const BookmarkRequestSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', example: 'My Bookmark' },
    description: { type: 'string', example: 'My Bookmark Description' },
    link: { type: 'string', example: 'https://example.com' },
  },
};

export const BookmarksArrayResponseSchema = {
  type: 'array',
  items: BookmarkResponseSchema,
};

export const BookmarkErrorSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    message: { type: 'string' },
    error: { type: 'string' },
  },
};
