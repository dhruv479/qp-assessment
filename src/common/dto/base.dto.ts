import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ErrorResponse {
	success: boolean;
	statusCode: number;
	timestamp: string;
	path: string;
	stack?: string;
	message?: any;
	name?: string;
}

export class SuccessResponse {
	success = true;
	status = 'OK';
	data: any;
	constructor(data) {
		this.data = data;
	}
}

export interface SuccessDto<T> {
	success: boolean;
	status: string;
	data: T;
}

export interface TokenPayload {
	id: number;
	email: string;
	name: string;
	admin: boolean;
}

export interface PGDatasource {
	host: string;
	port: string;
	type: string;
	username: string;
	password: string;
	database: string;
	pool?: number;
	debug?: boolean;
	name: string;
}

export class PaginationDto {
	@ApiPropertyOptional()
	@IsOptional()
	pageSize?: string;

	@ApiPropertyOptional()
	@IsOptional()
	pageNumber?: string;

	@ApiPropertyOptional()
	@IsOptional()
	sortBy?: string;

	@ApiPropertyOptional()
	@IsOptional()
	ascending?: string;
}

export interface ConfigOptions {
	label: string;
	value: string;
}

export enum USER_TYPE_ENUM {
	ADMIN = 'admin',
	CUSTOMER = 'customer',
}
