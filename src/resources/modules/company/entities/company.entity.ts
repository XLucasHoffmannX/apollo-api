import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { StoreEntity } from '../../store/entities/store.entity';
import { ProductEntity } from '../../product/entities/product.entity';

@Entity({ name: 'companies' })
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => UserEntity, (user) => user.company)
  users: UserEntity[];

  @OneToMany(() => StoreEntity, (store) => store.company)
  stores: StoreEntity[];

  @Column({ name: 'name', length: 60, nullable: false, default: '' })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  upadteAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
