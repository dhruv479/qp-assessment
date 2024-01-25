import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from './src/config/config.service';

const typeOrmConfig = new ConfigService().getTypeOrmConfig() as DataSourceOptions;

export default new DataSource(typeOrmConfig);
