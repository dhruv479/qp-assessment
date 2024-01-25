import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
	@ApiProperty()
	@IsString()
	@Transform(({ value }) => String(value).trim())
	@IsNotEmpty()
	title: string;

	@ApiPropertyOptional()
	@IsString()
	@Transform(({ value }) => String(value).trim())
	description?: string;

	@ApiProperty()
	@IsNumber()
	@Min(0)
	price: number;

	@ApiProperty()
	@IsNumber()
	@Min(0)
	mrp: number;

	@ApiPropertyOptional()
	@IsNumber()
	@Min(0)
	quantity?: number;
}

export class UpdateProductDto {
	@ApiPropertyOptional()
	@IsString()
	@Transform(({ value }) => String(value).trim())
	title?: string;

	@ApiPropertyOptional()
	@IsString()
	@Transform(({ value }) => String(value).trim())
	description?: string;

	@ApiPropertyOptional()
	@IsNumber()
	@Min(0)
	price?: number;

	@ApiPropertyOptional()
	@IsNumber()
	@Min(0)
	mrp?: number;

	@ApiPropertyOptional()
	@IsNumber()
	@Min(0)
	quantity?: number;

	@ApiPropertyOptional()
	@IsBoolean()
	is_active?: boolean;
}
