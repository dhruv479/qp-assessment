import { Injectable } from '@nestjs/common';
import { Constants } from '../common/constants';
import config from '../../config';
import { PGDatasource } from '../common/dto/base.dto';
import datasources from '../../datasources';
import { CustomNamingStrategy } from './naming-strategy';
import { Helper } from '../common/helpful';

@Injectable()
export class ConfigService {
	config: Record<string, any>;
	rawDatasources: Record<string, any>;
	postgresSources: PGDatasource[];

	constructor() {
		this.config = config;
		this.rawDatasources = datasources;
		const pgSources = [];
		let mongoSource;
		for (const dsKey in datasources) {
			const ds = datasources[dsKey];
			if (ds.type === 'postgres') {
				pgSources.push(ds);
			} else {
				mongoSource = ds;
			}
		}
		this.postgresSources = pgSources;
	}

	getConfig(): Record<string, any> {
		return this.config;
	}

	public getConnectionConfigByName(connectionName: string): any {
		return this.rawDatasources[connectionName];
	}

	public getValue(key: string, errorOnMissing = true) {
		const value = this.config[key];
		if (!value && errorOnMissing) {
			throw new Error(`config error - missing config.${key}`);
		}

		return value;
	}

	public getEnv(): string {
		return process.env.NODE_ENV || Constants.DEV_ENV;
	}

	public isDev(): boolean {
		return this.getEnv() === Constants.DEV_ENV;
	}

	public isProduction(): boolean {
		return this.getEnv() === Constants.PROD_ENV;
	}

	public getTypeOrmConfig(connectionName = Constants.DEFAULT_PG_NAME): object {
		const postgresSource = this.getConnectionConfigByName(connectionName);
		const { host, port, username, password, database, type = 'postgres' } = postgresSource;
		return {
			type,
			host,
			port,
			username,
			password,
			database,
			entities: ['dist/**/**/*.entity{.ts,.js}'],
			migrationsTableName: 'typeorm_migrations',
			migrations: ['dist/migrations/*.ts'],
			ssl: this.isProduction(),
			logging: Helper.parseBoolean(process.env.DEBUG),
			autoLoadEntities: this.isDev(),
			namingStrategy: new CustomNamingStrategy(),
			synchronize: this.isDev(),
		};
	}
}
