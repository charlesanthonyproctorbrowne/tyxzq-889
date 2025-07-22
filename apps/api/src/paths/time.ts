import { Request, Response } from 'express';
import { Operation } from 'express-openapi';

export const GET: Operation = (req: Request, res: Response) => {
  const currentTime = new Date().toISOString();
  return res.json({ current_time: currentTime });
};

GET.apiDoc = {
  description: 'Fetches current server time',
  operationId: 'time',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            properties: {
              current_time: {
                type: 'string',
              },
            },
            required: ['current_time'],
            type: 'object',
          },
        },
      },
      description: `The current server time`,
    },
  },
};
