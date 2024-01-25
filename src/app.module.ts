import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/products/product.module';
import { OrderModule } from './modules/orders/order.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(new ConfigService().getTypeOrmConfig() as TypeOrmModuleOptions),
		ConfigModule,
		UserModule,
		ProductModule,
		OrderModule,
	],
	controllers: [],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer
			.apply(AuthMiddleware)
			.exclude(
				{
					path: '/api/user/login',
					method: RequestMethod.POST,
				},
				{
					path: '/api/user/signup',
					method: RequestMethod.POST,
				},
				{ path: '/', method: RequestMethod.GET },
			)
			.forRoutes('*');
	}
}
