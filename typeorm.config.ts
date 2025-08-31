import { DataSource } from 'typeorm';
import 'dotenv/config';

export default new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
  entities: [`${process.cwd()}/**/*.entity.{ts,js}`],
  migrations: [`${process.cwd()}/migrations/*.ts`],
});
