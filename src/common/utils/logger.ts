import pino, { stdSerializers } from 'pino';
import { Constants } from '../constants';
import { pick } from 'lodash';
const pkg = require('../../package.json');

const isDev = process.env.NODE_ENV === Constants.DEV_ENV;

const transport = pino.transport({
	target: 'pino-pretty',
	options: { colorize: true },
});

export const logger = pino(
	{
		name: pkg.name,
		timestamp: true,
		level: 'info',
		formatters: {
			level(l) {
				return { level: l };
			},
		},
		redact: {
			paths: ['req.body.otp', 'req.body.password', 'req.headers.authorization', 'req.headers.access_token'],
			censor: '**SECRET**',
		},
		serializers: {
			req(req) {
				if (isDev) {
					return pick(req, ['url', 'method']);
				}

				return stdSerializers.req(req);
			},
			res(res) {
				if (isDev) {
					return pick(res, ['statusCode']);
				}

				return pick(res, ['statusCode', 'message', 'error']);
			},
		},
	},
	transport,
);
