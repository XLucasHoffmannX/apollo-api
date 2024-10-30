import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyEntity } from '../../company/entities/company.entity';
import { ProductEntity } from '../../product/entities/product.entity';
import { OrderEntity } from '../../order/entities/order.entity';
import { StoreSetupEntity } from '../../store-setup/entities/store-setup.entity';

@Entity({ name: 'stores' })
export class StoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CompanyEntity, (company) => company.stores, {
    nullable: false,
  })
  company: CompanyEntity;

  @OneToMany(() => ProductEntity, (store) => store.store)
  products: ProductEntity[];

  @OneToMany(() => OrderEntity, (order) => order.store)
  orders: OrderEntity[];

  @OneToOne(() => StoreSetupEntity, (storeSetup) => storeSetup.store, {
    nullable: false,
  })
  storeSetup: StoreSetupEntity;

  @Column({ name: 'name', length: 60, nullable: false, unique: true })
  name: string;

  @Column({ name: 'domain', length: 60, nullable: false })
  domain: string;

  @Column({ name: 'status', nullable: false, default: true })
  status: boolean;

  @Column({ name: 'title', length: 60, nullable: false })
  title: string;

  @Column({ name: 'description', length: 120, nullable: false })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  upadteAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
