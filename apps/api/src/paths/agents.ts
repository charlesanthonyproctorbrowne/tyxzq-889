import { Request, Response } from 'express';
import { Operation } from 'express-openapi';
import { Agent } from '../util/models/Agent';

export const GET: Operation = async (req: Request, res: Response) => {
  const agents = await Agent.findAll();

  return res.send({ data: agents });
};

GET.apiDoc = {
  description: 'Fetches all agents',
  operationId: 'agents',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            properties: {
              data: {
                type: 'array',
                items: {
                  properties: {
                    id: {
                      type: 'number',
                    },
                    name: {
                      type: 'string',
                    },
                  },
                  type: 'object',
                },
              },
            },
            required: ['data'],
            type: 'object',
          },
        },
      },
      description: `agents`,
    },
  },
};
