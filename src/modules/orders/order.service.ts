import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { DataSource, MoreThan, Not, Repository } from 'typeorm';

import { PaginationDto } from '../../common/dto/base.dto';
import { Helper } from '../../common/helpful';
import { OrderItemEntity } from './order-item.entity';
import { ProductEntity } from '../products/product.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>,
		@InjectRepository(OrderItemEntity) private readonly orderItemRepository: Repository<OrderItemEntity>,
		@InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		private dataSource: DataSource,
	) {}

	async addOrder(orderCreateDto: any, userId: number) {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.startTransaction();
		const queryManager = queryRunner.manager;
		try {
			const orderData = await queryManager.save(OrderEntity, {
				user_id: userId,
				price: 0,
			});
			let totalPrice = 0;
			const orderId = orderData.id;
			for (const item of orderCreateDto) {
				const { productId, quantity } = item;
				const product = await this.productRepository.findOne({ where: { id: productId } });
				if (!product) {
					throw new ForbiddenException('Invalid Product details');
				}
				if (product.quantity < quantity) {
					throw new ForbiddenException(`Product ${product.title} quantity is less than order volume`);
				}

				await queryManager.update(ProductEntity, { id: productId }, { quantity: product.quantity - quantity });
				await queryManager.save(OrderItemEntity, {
					order_id: orderId,
					product_id: productId,
					quantity,
					price: product.price,
				});
				totalPrice += quantity * product.price;
			}
			orderData.price = totalPrice;
			await queryManager.update(OrderEntity, { id: orderId }, orderData);
			await queryRunner.commitTransaction();

			return {
				message: 'Order Created Successfully',
			};
		} catch (err) {
			await queryRunner.rollbackTransaction();
			throw err;
		} finally {
			await queryRunner.release();
		}
	}

	async listOrders(paginationDto: PaginationDto, userId: string, isAdmin: boolean) {
		const paginationArgs = Helper.validatePagination(paginationDto);

		let wherePart = {};
		if (!isAdmin) {
			wherePart = { user_id: userId };
		}
		const countResponse = await this.orderRepository.count({ where: wherePart });
		const orders = await this.orderRepository.find({ where: wherePart, ...paginationArgs.queryPart });

		for (const order of orders) {
			const orderItems = await this.orderItemRepository.find({ where: { order_id: order.id } });
			order['items'] = orderItems.map((elem: any) => {
				const {
					quantity,
					price,
					product: { title, description },
				} = elem;
				return {
					title,
					description,
					quantity,
					price,
				};
			});

			order['user'] = await this.userRepository.findOne({ where: { id: order.user_id }, select: { name: true, id: true } });
		}
		return {
			...Helper.blacklist(paginationArgs, ['queryPart']),
			totalCount: countResponse,
			pageData: orders,
		};
	}
}
