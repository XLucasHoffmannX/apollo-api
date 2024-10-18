import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyEntity } from '../../company/entities/company.entity';
import { ProductEntity } from '../../product/entities/product.entity';
import { OrderEntity } from '../../order/entities/order.entity';

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

  @Column({ name: 'name', length: 60, nullable: false })
  name: string;

  @Column({ name: 'title', length: 60, nullable: false })
  title: string;

  @Column({ name: 'description', length: 120, nullable: false })
  description: string;
}
