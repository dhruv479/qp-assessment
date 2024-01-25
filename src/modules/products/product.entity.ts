import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity({ name: 'product' })
export class ProductEntity extends BaseEntity {
	@Column({ type: 'varchar' })
	title: string;

	@Column({ type: 'varchar', nullable: true })
	description: string;

	@Column({ type: 'integer' })
	price: number;

	@Column({ type: 'integer' })
	mrp: number;

	@Column({ type: 'integer', default: 0 })
	quantity: number;

	@Column({ type: 'boolean', default: true })
	is_active: boolean;
}
