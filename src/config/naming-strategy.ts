import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase, hash } from 'typeorm/util/StringUtils';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
	relationName(propertyName: string): string {
		return snakeCase(propertyName + hash(String(Date.now())));
	}

	columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
		return snakeCase(embeddedPrefixes.concat('').join('_')) + (customName ? customName : snakeCase(propertyName));
	}

	joinColumnName(relationName: string, referencedColumnName: string): string {
		return snakeCase(relationName);
	}

	joinTableName(firstTableName: string, secondTableName: string, firstPropertyName: string, secondPropertyName: string): string {
		return snakeCase(firstTableName + '_' + firstPropertyName.replace(/\./gi, '_') + '_' + secondTableName);
	}

	joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
		return snakeCase(tableName + '_' + (columnName ? columnName : propertyName));
	}
}
