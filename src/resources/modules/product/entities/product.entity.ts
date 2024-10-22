import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoreEntity } from '../../store/entities/store.entity';
import { ProductImageEntity } from '../../product-image/entities/product-image.entity';
import { DecimalTransformer } from 'src/resources/shared/utils/DecimalTransform';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', length: 60, nullable: false, default: '' })
  name: string;

  @ManyToOne(() => StoreEntity, (store) => store.products)
  store: StoreEntity;

  @OneToMany(
    () => ProductImageEntity,
    (productImages) => productImages.product,
    { cascade: true },
  )
  images: ProductImageEntity[];

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
    transformer: DecimalTransformer,
  })
  price: number;

  @Column({ name: 'description', length: 140, nullable: false, default: '' })
  description: string;

  @Column({ name: 'content', length: 280, nullable: false, default: '' })
  content: string;

  @Column({ name: 'available', nullable: false, default: 0 })
  available: number;

  @Column({ name: 'discount', nullable: false, default: 0 })
  discount: number;

  @Column({ name: 'quantity', nullable: false, default: 0 })
  quantity: number;

  @Column({ name: 'min_quantity', nullable: false, default: 0 })
  minQuantity: number;

  @Column({ name: 'category', nullable: true, default: '' })
  category: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  upadteAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
