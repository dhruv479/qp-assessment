import { Injectable, CanActivate, ExecutionContext, ForbiddenException, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Constants } from '../constants';
import { USER_TYPE_ENUM } from '../dto/base.dto';

@Injectable()
export class PermissionGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRole = this.reflector.get<string>(Constants.PERMISSION_METADATA_KEY, context.getHandler());
		if (!requiredRole) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const { admin } = request.USER;

		if (!admin && requiredRole === USER_TYPE_ENUM.ADMIN) {
			throw new ForbiddenException('No Permission for this Action');
		}
		return true;
	}
}
