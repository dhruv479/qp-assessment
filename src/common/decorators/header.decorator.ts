import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export function Headers() {
	return applyDecorators(ApiBearerAuth('bearerAuth'));
}
