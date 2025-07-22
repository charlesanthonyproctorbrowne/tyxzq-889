import { expressOpenApi } from '../dist/apps/api/service/express-openapi';
import express from 'express';
import fs from 'fs';
import path from 'path';

const OUTPUT_PATH = path.resolve(__dirname, '..', 'tmp', 'schema.json');

const main = async () => {
  const app = express();
  const expressOpenapiApp = await expressOpenApi(app);

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(expressOpenapiApp.apiDoc));

  console.log(`Wrote schema to ${OUTPUT_PATH}`);
};

main();
