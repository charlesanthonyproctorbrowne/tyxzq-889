import { Request, Response } from 'express';
import { Operation } from 'express-openapi';
import { locationCoords } from '../util/locationCoords';
import { coordsToTemp } from '../util/coordsToTemp';

// Simple delay helper to space out API calls and avoid rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Aggregates current temperature data for all predefined locations
// to provide a comprehensive weather overview in a single API response
export const GET: Operation = async (req: Request, res: Response) => {
  // Transform location coordinates into temperature promises with staggered delays
  // to prevent overwhelming the external API with concurrent requests
  const weatherPromises = Object.keys(locationCoords).map(
    async (key, index) => {
      // Stagger requests by 200ms each to respect API rate limits
      await delay(index * 200);

      const coords = locationCoords[key];
      const temp = await coordsToTemp(coords.lat, coords.long);
      return { location: key, temp };
    }
  );

  const result = await Promise.all(weatherPromises);

  return res.send({ data: result });
};

GET.apiDoc = {
  description: 'Fetches current weather of various locations',
  operationId: 'weather',
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
                    location: {
                      type: 'string',
                    },
                    temp: {
                      type: 'number',
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
      description: `weather`,
    },
  },
};
