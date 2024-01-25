import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
	@Column({ type: 'varchar' })
	name: string;

	@Column({ type: 'varchar', length: 200 })
	password: string;

	@Column({ type: 'varchar' })
	email: string;

	@Column({ type: 'varchar', nullable: true })
	phone: string;

	@Column({ type: 'boolean', default: true })
	is_active: boolean;

	@Column({ type: 'boolean', default: false })
	is_admin: boolean;

	@Column({ type: 'timestamptz', default: null, nullable: true })
	last_login_at: Date;
}
