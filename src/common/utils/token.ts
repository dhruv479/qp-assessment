import * as jwt from 'jsonwebtoken';
import { TokenPayload } from '../dto/base.dto';

export class TokenUtil {
	config: any;
	constructor() {
		this.config = (global as any).config;
	}

	secretBuffer = (): Buffer => {
		return Buffer.from(this.config.TOKEN_KEY as string, 'base64');
	};

	// For generating access token
	generate(payload: TokenPayload): string {
		const secret = this.secretBuffer();

		return jwt.sign(payload, secret, {
			expiresIn: this.config.TOKEN_EXP,
		});
	}

	verify(token: string): TokenPayload {
		const secret = this.secretBuffer();

		return jwt.verify(token, secret, {
			algorithms: ['HS256'],
		}) as TokenPayload;
	}
}
