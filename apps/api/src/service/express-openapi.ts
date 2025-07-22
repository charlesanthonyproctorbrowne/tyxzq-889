import type { Express } from 'express';
import { initialize } from 'express-openapi';
import path from 'path';
import fs from 'fs';

// Recursively scan directory to understand file structure and debug routing issues
const debugDirectoryContents = (dirPath: string, prefix = ''): void => {
  try {
    console.log(`${prefix}📁 Scanning directory: ${dirPath}`);

    if (!fs.existsSync(dirPath)) {
      console.log(`${prefix}❌ Directory does not exist: ${dirPath}`);
      return;
    }

    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    console.log(`${prefix}📊 Found ${items.length} items in directory`);

    items.forEach((item, index) => {
      const itemPath = path.join(dirPath, item.name);
      const isLast = index === items.length - 1;
      const connector = isLast ? '└──' : '├──';

      if (item.isDirectory()) {
        console.log(`${prefix}${connector} 📂 ${item.name}/`);
        // Recursively scan subdirectories
        debugDirectoryContents(
          itemPath,
          `${prefix}${isLast ? '    ' : '│   '}`
        );
      } else {
        const stats = fs.statSync(itemPath);
        const extension = path.extname(item.name);
        const isJsFile = extension === '.js';
        const isTsFile = extension === '.ts';

        console.log(
          `${prefix}${connector} 📄 ${item.name} (${stats.size} bytes) ${
            isJsFile ? '✅ JS' : isTsFile ? '🔄 TS' : '❓'
          }`
        );

        // For potential route files, show additional details
        if (isJsFile || isTsFile) {
          try {
            const content = fs.readFileSync(itemPath, 'utf8');
            const hasGETExport = /export\s+const\s+GET/m.test(content);
            const hasPOSTExport = /export\s+const\s+POST/m.test(content);
            const hasApiDoc = /\.apiDoc\s*=/m.test(content);

            if (hasGETExport || hasPOSTExport || hasApiDoc) {
              console.log(
                `${prefix}${
                  isLast ? '    ' : '│   '
                }    🔍 Route exports: GET:${hasGETExport} POST:${hasPOSTExport} ApiDoc:${hasApiDoc}`
              );
            }
          } catch (error) {
            console.log(
              `${prefix}${
                isLast ? '    ' : '│   '
              }    ❌ Could not read file: ${error}`
            );
          }
        }
      }
    });
  } catch (error) {
    console.log(`${prefix}❌ Error scanning directory: ${error}`);
  }
};

// Configure and initialize OpenAPI routing with comprehensive debugging
export const expressOpenApi = async (app: Express) => {
  console.log('🚀 Starting express-openapi initialization...');

  // Resolve the paths directory relative to the compiled JavaScript output
  const routesPath = path.resolve(__dirname, '..', 'paths');
  console.log(`📂 Resolved routes path: ${routesPath}`);
  console.log(`📍 Current __dirname: ${__dirname}`);
  console.log(`📍 Process cwd: ${process.cwd()}`);

  // Debug directory structure
  console.log('\n=== DIRECTORY STRUCTURE DEBUG ===');
  debugDirectoryContents(routesPath);
  console.log('================================\n');

  // Test different possible paths if the primary doesn't exist
  const alternativePaths = [
    path.resolve(__dirname, 'paths'),
    path.resolve(__dirname, '..', '..', 'paths'),
    path.resolve(process.cwd(), 'apps', 'api', 'src', 'paths'),
    path.resolve(process.cwd(), 'src', 'paths'),
  ];

  console.log('🔍 Testing alternative path locations:');
  alternativePaths.forEach((altPath, index) => {
    const exists = fs.existsSync(altPath);
    console.log(
      `  ${index + 1}. ${altPath} - ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`
    );
    if (exists) {
      const items = fs.readdirSync(altPath);
      console.log(
        `     📊 Contains ${items.length} items: [${items.join(', ')}]`
      );
    }
  });

  // Detect if we're running with TypeScript files
  const hasTypeScriptFiles = fs
    .readdirSync(routesPath)
    .some((file) => file.endsWith('.ts'));
  const isTypeScriptRuntime =
    hasTypeScriptFiles &&
    (process.env.TS_NODE_PROJECT || __filename.endsWith('.ts'));

  console.log(
    `🔍 Runtime detection: TypeScript files present: ${hasTypeScriptFiles}, ts-node active: ${isTypeScriptRuntime}`
  );

  console.log('\n🔧 Express-OpenAPI configuration:');
  const config = {
    apiDoc: {
      info: {
        title: 'Connex Tech Test API',
        version: '0.0.1',
      },
      openapi: '3.1.0',
      paths: {},
    },
    app,
    promiseMode: true,
    paths: routesPath,
    // Use appropriate glob pattern based on what files exist
    routesGlob: isTypeScriptRuntime ? '**/*.ts' : '**/*.js',
    routesIndexFileRegExp: isTypeScriptRuntime
      ? /(?:index)?\.ts$/
      : /(?:index)?\.js$/,
    // Custom loader to handle TypeScript files
    ...(isTypeScriptRuntime && {
      customizeOperation: undefined, // Reset any default loaders
      customizeSchema: undefined,
    }),
  };

  console.log(`  📋 Paths directory: ${config.paths}`);
  console.log(`  🔍 Routes glob pattern: ${config.routesGlob}`);
  console.log(`  📝 Index file regex: ${config.routesIndexFileRegExp}`);
  console.log(`  ⚡ Promise mode: ${config.promiseMode}`);
  console.log(`  🔧 TypeScript mode: ${isTypeScriptRuntime}`);

  try {
    console.log('\n⚙️ Initializing express-openapi...');

    if (isTypeScriptRuntime) {
      // For TypeScript, we need to manually load and register routes
      console.log('🔄 Using TypeScript-compatible route loading...');

      // Get all TypeScript route files
      const routeFiles = fs
        .readdirSync(routesPath)
        .filter((file) => file.endsWith('.ts'))
        .map((file) => path.join(routesPath, file));

      console.log(`📋 Found ${routeFiles.length} TypeScript route files`);

      // Temporarily set to look for JS files to avoid the import error
      const tsConfig = {
        ...config,
        routesGlob: '**/*.js', // This prevents express-openapi from finding the TS files
        routesIndexFileRegExp: /(?:index)?\.js$/,
      };

      const result = await initialize(tsConfig);

      // Manually load and register TypeScript routes
      for (const routeFile of routeFiles) {
        try {
          console.log(`🔄 Manually loading route: ${path.basename(routeFile)}`);

          // Clear require cache for hot reloading
          delete require.cache[require.resolve(routeFile)];

          const routeModule = require(routeFile);
          const routeName = '/' + path.basename(routeFile, '.ts');

          // Register the route operations
          if (routeModule.GET) {
            app.get(routeName, routeModule.GET);
            console.log(`  ✅ Registered GET ${routeName}`);
          }
          if (routeModule.POST) {
            app.post(routeName, routeModule.POST);
            console.log(`  ✅ Registered POST ${routeName}`);
          }
          if (routeModule.PUT) {
            app.put(routeName, routeModule.PUT);
            console.log(`  ✅ Registered PUT ${routeName}`);
          }
          if (routeModule.DELETE) {
            app.delete(routeName, routeModule.DELETE);
            console.log(`  ✅ Registered DELETE ${routeName}`);
          }
        } catch (error) {
          console.error(`❌ Failed to load route ${routeFile}:`, error);
        }
      }

      return result;
    } else {
      // Standard JavaScript mode
      const result = await initialize(config);
      console.log('✅ Express-OpenAPI initialization completed successfully');
      return result;
    }
  } catch (error) {
    console.error('❌ Express-OpenAPI initialization failed:');
    console.error('   Error message:', error);
    console.error('   Error stack:', error);
    throw error;
  }
};
