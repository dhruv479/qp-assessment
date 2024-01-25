import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { Constants } from './common/constants';
import { NullTransform } from './common/pipes/null-check.pipes';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import config from '../config';
import datasources from '../datasources';
import * as fs from 'fs';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { PermissionGuard } from './common/guards/permission.guard';

if (!config) {
	console.error('Please provide config.ts');
	process.exit(1);
}
(global as any).config = { ...config };
(global as any).datasources = { ...datasources };

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
		logger: ['error', 'warn', 'debug', 'log'],
		cors: true,
	});

	const httpAdapter = app.get(HttpAdapterHost);
	const version = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
	app.useGlobalPipes(new NullTransform())
		.useGlobalPipes(
			new ValidationPipe({
				transform: false,
				whitelist: true,
			}),
		)
		.useGlobalFilters(new AllExceptionsFilter(httpAdapter))
		.use(helmet())
		.useGlobalInterceptors(new ResponseInterceptor())
		.useGlobalGuards(new PermissionGuard(new Reflector()))
		.setGlobalPrefix('api', {
			exclude: [{ path: '/', method: RequestMethod.GET }],
		});

	if (process.env.NODE_ENV === Constants.PROD_ENV) {
		app.useGlobalInterceptors(new TimeoutInterceptor());
	}

	await app.listen(Number(process.env.PORT) || Constants.DEFAULT_PORT);
	console.log(`Application is running on: ${await app.getUrl()}`);
	console.log(`Version: ${version.version}`);

	return app;
}

export default bootstrap().then((app) => app);
// export default app;
