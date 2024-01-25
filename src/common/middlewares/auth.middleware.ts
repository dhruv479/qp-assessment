import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Constants } from '../constants';
import { Helper } from '../helpful';
import { TokenUtil } from '../utils/token';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	async use(req: Request, res: Response, next: NextFunction) {
		try {
			const NO_AUTH = process.env.NO_AUTH;

			if (Helper.parseBoolean(NO_AUTH)) {
				next();
			}

			const authToken = req.headers.authorization as string;

			if (!authToken) {
				throw new UnauthorizedException('Unauthorized Access! Please login.');
			}

			const [, token] = authToken.split(' ');

			if (!token) {
				throw new UnauthorizedException('Unauthorized Access! Please login.');
			}

			const decoded = await new TokenUtil().verify(token);
			if (process.env.NODE_ENV !== Constants.DEV_ENV) {
				throw new UnauthorizedException('Unauthorized Access! Please login.');
			}
			req.USER = decoded;

			next();
		} catch {
			throw new UnauthorizedException('Unauthorized Access! Please login.');
		}
	}
}
