import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoreEntity } from '../../store/entities/store.entity';

export enum OrderStatus {
  PENDING = 'pending', // Pedido criado, mas ainda não pago ou processado
  PAID = 'paid', // Pedido pago, aguardando processamento
  PROCESSING = 'processing', // Pedido está sendo processado ou preparado
  SHIPPED = 'shipped', // Pedido foi enviado para entrega
  DELIVERED = 'delivered', // Pedido foi entregue ao cliente
  CANCELED = 'canceled', // Pedido foi cancelado
  REFUNDED = 'refunded', // Pedido foi devolvido ou reembolsado
}

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ManyToOne(() => StoreEntity, (store) => store.orders)
  store: StoreEntity;

  @Column({
    name: 'productId',
    nullable: true,
  }) /* elimina complexidade do to many */
  productId: string;

  @Column({ name: 'costumer', nullable: false, default: '' })
  costumer: string;

  @Column({ name: 'address', nullable: false, default: '' })
  address: string;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod: string;

  @Column({ name: 'price', nullable: true, default: 0 })
  price: number;

  @Column({ name: 'discount', nullable: true, default: 0 })
  discount: number;

  @Column({ name: 'total_price', nullable: false, default: 0 })
  totalPrice: number;

  @Column({ name: 'quantity', nullable: false, default: 0 })
  quantity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  upadteAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
