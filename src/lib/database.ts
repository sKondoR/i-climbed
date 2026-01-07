import 'reflect-metadata';
import { DataSource } from 'typeorm';
import type { ObjectLiteral } from 'typeorm';
import { Region  } from '@/models/Region';
import { Place } from '@/models/Place';
import { Sector } from '@/models/Sector';
import { Route } from '@/models/Route';
import { Image } from '@/models/Image';
import { Settings } from '@/models/Settings';

let AppDataSource: DataSource;

export async function getDataSource(): Promise<DataSource> {
  if (AppDataSource?.isInitialized) {
    return AppDataSource;
  }

  try {
    AppDataSource = new DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT) | 5432,
        url: process.env.POSTGRES_URL,
        database: process.env.POSTGRES_DB_NAME,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        entities: [
          Region,
          Place,
          Sector,
          Route,
          Image,
          Settings,
        ],
        synchronize: process.env.NODE_ENV === 'development',
        logging: process.env.NODE_ENV === 'development',
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // ssl: process.env.NODE_ENV === 'production',
    });

    await AppDataSource.initialize();
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
