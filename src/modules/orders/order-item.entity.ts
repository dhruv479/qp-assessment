import { Column, Entity, JoinColumn, JoinTable, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { ProductEntity } from '../products/product.entity';

@Entity({ name: 'orderitem' })
export class OrderItemEntity extends BaseEntity {
	@Column({ type: 'integer' })
	product_id: number;

	@OneToOne(() => ProductEntity, (product) => product.id, { eager: true })
	@JoinColumn({ name: 'product_id' })
	product: ProductEntity;

	@Column({ type: 'integer' })
	quantity: number;

	@Column({ type: 'integer' })
	price: number;

	@Column({ type: 'integer' })
	order_id: number;
}
