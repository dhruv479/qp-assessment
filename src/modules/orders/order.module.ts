import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderItemEntity } from './order-item.entity';
import { ProductEntity } from '../products/product.entity';
import { UserEntity } from '../user/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, ProductEntity, UserEntity])],
	controllers: [OrderController],
	providers: [OrderService],
})
export class OrderModule {}
