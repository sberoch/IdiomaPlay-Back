import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config = {
  jwtSecret: process.env.JWT_SECRET,
  errorCodes: {
    DUP_KEY: 'DUP_KEY',
    VIO_FK: 'VIO_FK',
    UNK_ERR: 'UNK_ERR',
  },
};

const devDatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'user',
  password: 'pass',
  database: 'db',
  autoLoadEntities: true,
  synchronize: true,
};

//TODO: remove sync to add migrations
const prodDatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  ssl: { rejectUnauthorized: false },
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: true,
};

export const dbConfig =
  process.env.PRODUCTION === 'true' ? prodDatabaseConfig : devDatabaseConfig;
