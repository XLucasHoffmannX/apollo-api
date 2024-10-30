import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoreEntity } from '../../store/entities/store.entity';

export type ThemeUtilType = {
  [key: string]: string;
};

export type ThemeType =
  | 'zinc'
  | 'slate'
  | 'stone'
  | 'gray'
  | 'neutral'
  | 'red'
  | 'rose'
  | 'orange'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'violet';

export interface IThemeVariables {
  header?: {
    titleColor: string;
    subTitleColor: string;
    logoAccept: boolean;
  };
  light: ThemeUtilType;
  dark: ThemeUtilType;
}

export interface ISetup {
  client: {
    clientName: string;
    clientLogo: string;
    clientDescription: string;
    titleHmtl: string;
    clientDomain: string;
    clientBackground?: string;
    mediaLinks?: string[];
    useBackgroundDefaultPage?: boolean;
  };
  theme: IThemeVariables;
}

@Entity({ name: 'store-setup' })
export class StoreSetupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => StoreEntity, (store) => store.storeSetup, { nullable: false })
  @JoinColumn()
  store: StoreEntity;

  @Column({ type: 'varchar', length: 20, default: 'blue' })
  themeType: string;

  @Column({ type: 'json', nullable: false })
  setup: ISetup;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  upadteAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
