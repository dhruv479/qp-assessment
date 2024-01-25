export class Constants {
	static readonly DEFAULT_PORT = 4000;
	static readonly DEV_ENV = 'dev';
	static readonly PROD_ENV = 'prod';
	static readonly SALT_ROUNDS = 10;
	static readonly DEFAULT_PG_NAME = 'postgres';
	static readonly SEVERITY_TYPES = {
		WARNING: 'warning',
		FAULT: 'fault',
		ALERT: 'alert',
		INFO: 'info',
		DEBUG: 'debug',
	};

	static readonly USER_TYPES = {
		ADMIN: 'admin',
		CUSTOMER: 'customer',
	};

	static readonly PERMISSION_METADATA_KEY = 'permissions';

	static readonly DEFAULT_PAGESIZE = 10;
	static readonly MAXIMUM_PAGESIZE = 100;
	static readonly DEFAULT_PAGENUM = 1;
	static readonly VALID_SORT_KEYS = ['id', 'created_at', 'updated_at'];
	static readonly DEFAULT_ORDER = 'ASC';
	static readonly DATABASE_TYPE = {
		PSQL: 'psql',
	};
}
