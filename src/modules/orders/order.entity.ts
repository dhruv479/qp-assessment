import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { OrderItemEntity } from './order-item.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'order' })
export class OrderEntity extends BaseEntity {
	@Column({ type: 'integer' })
	price: number;

	@Column({ type: 'integer' })
	user_id: number;
}
