import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

export abstract class BaseEntity {
	@PrimaryGeneratedColumn('increment', { type: 'integer' })
	id: number;

	@CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
	created_at: Date;

	@Column({ type: 'integer', nullable: true })
	created_by: number;

	@UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
	updated_at: Date;

	@Column({ type: 'integer', nullable: true })
	updated_by: number;

	@Column({ type: 'jsonb', nullable: true })
	extra_details: object;
}
