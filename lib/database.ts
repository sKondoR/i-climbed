import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Region } from '@/models/Region';

let AppDataSource: DataSource;

export async function getDataSource(): Promise<DataSource> {
  if (AppDataSource?.isInitialized) {
    return AppDataSource;
  }

  try {
    AppDataSource = new DataSource({
        type: 'mongodb',
        url: process.env.MONGODB_URI,
        database: process.env.MONGODB_DB_NAME || 'test',
        entities: [Region],
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
  return {
    dataSource,
    getRepository: (entity: any) => dataSource.getMongoRepository(entity),
  };
}