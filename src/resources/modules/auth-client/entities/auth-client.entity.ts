import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'auth-clients' })
export class AuthClient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', length: 24, nullable: false })
  client: string;

  @Column({ name: 'token', nullable: false })
  token: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  upadteAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
