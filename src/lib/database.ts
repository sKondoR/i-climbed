import 'reflect-metadata';
import { Place } from '../models/Place';
import { Region } from '../models/Region';
import { Route } from '../models/Route';
import { Sector } from '../models/Sector';
import { Settings } from '../models/Settings';
import { Image } from '../models/Image';
import { DataSource } from 'typeorm';
import type { ObjectLiteral } from 'typeorm';
import path from 'path';
import fs from 'fs';

let AppDataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (AppDataSource?.isInitialized) {
    return AppDataSource;
  }
  const isProd = process.env.NODE_ENV === 'production';
  const entitiesPath = isProd
    // ? ['**/models/*.js' ]
    ? __dirname + '/models/*.js'
    : [
        Settings,
        Region,
        Place,
        Sector,
        Route,
        Image,
      ];

    console.log('=== DATABASE DEBUG INFO ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Current directory:', __dirname);
    console.log('Process directory:', process.cwd());

    // List files in entities directory
    try {
      const modelsPath = path.join(__dirname, 'models');
      console.log('Entity path:', modelsPath);
      
      if (fs.existsSync(modelsPath)) {
        const files = fs.readdirSync(modelsPath);
        console.log('Entity files found:', files);
      } else {
        console.log('Entity directory does not exist!');
      }
    } catch (error) {
      console.log('Error reading entity directory:', error);
    }
      
  const modelsPath = path.join(__dirname, 'models');  
  try {
    AppDataSource = new DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT) || 5432,
        url: process.env.POSTGRES_URL,
        database: process.env.POSTGRES_DB_NAME,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        entities: modelsPath,
        synchronize: !isProd,
        logging: !isProd,
        logger: 'simple-console',
        ssl: isProd ? { 
          rejectUnauthorized: false 
        } : false,
        extra: {
          max: 1, // Important for serverless
          connectionLimit: 10,
          idleTimeoutMillis: 600000, // Время ожидания бездействия перед закрытием соединения
          connectionTimeoutMillis: 20000, // Таймаут подключения к базе данных
        }
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // ssl: process.env.NODE_ENV === 'production',
    });

    await AppDataSource.initialize().catch((err) => {
      console.error('Data source initialization failed', err)
      process.exit(1)
    });

    console.log('Registered entities:', AppDataSource.entityMetadatas.map(e => e.name));
    console.log('Database connected successfully');
    return AppDataSource;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

// For Vercel serverless functions, initialize on demand
export async function getDatabase() {
  const dataSource = await getDataSource();
  // dataSource.dropDatabase();
  // await dataSource.synchronize(true);
  return {
    dataSource,
    getRepository: <T extends ObjectLiteral>(entity: new () => T) => {
      return dataSource.getRepository<T>(entity);
    },
  };
}

export async function closeDataSource() {
  if (AppDataSource?.isInitialized) {
    await AppDataSource.destroy();
    AppDataSource = null;
  }
}
