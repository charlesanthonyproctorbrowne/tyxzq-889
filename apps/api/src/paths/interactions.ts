import { Request, Response } from 'express';
import { Operation } from 'express-openapi';
import { Interaction } from '../util/models/Interaction';

export const GET: Operation = async (req: Request, res: Response) => {
  const interactions = await Interaction.findAll();

  return res.send({ data: interactions });
};

GET.apiDoc = {
  description: 'Fetches all interactions',
  operationId: 'interactions',
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
                    agent_id: {
                      type: 'number',
                    },
                    customer_id: {
                      type: 'number',
                    },
                    length_seconds: {
                      type: 'number',
                    },
                    created_at: {
                      type: 'string',
                      format: 'date',
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
      description: `interactions`,
    },
  },
};
