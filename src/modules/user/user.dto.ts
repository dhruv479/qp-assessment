import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserLoginDto {
	@ApiProperty()
	@IsEmail()
	@Transform(({ value }) => String(value).trim())
	@IsNotEmpty()
	email: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	password: string;
}

export class UserSignupDto {
	@ApiProperty()
	@IsString()
	@Transform(({ value }) => String(value).trim())
	name: string;

	@ApiProperty()
	@IsString()
	@MinLength(8)
	password: string;

	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsString()
	@Transform(({ value }) => String(value).trim())
	phone: string;
}

export class UpdateUserDto {
	@ApiPropertyOptional()
	@IsString()
	@Transform(({ value }) => String(value).trim())
	@IsOptional()
	name?: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	password?: string;

	@ApiPropertyOptional()
	@IsEmail()
	@IsOptional()
	email?: string;

	@ApiPropertyOptional()
	@IsString()
	@Transform(({ value }) => String(value).trim())
	@IsOptional()
	phone?: string;

	@ApiPropertyOptional()
	@IsOptional()
	is_active?: boolean;

	@ApiPropertyOptional()
	@IsOptional()
	is_admin?: boolean;
}

export class UpdatePasswordDto {
	@ApiProperty()
	@IsString()
	password: string;
}
