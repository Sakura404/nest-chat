import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne((type) => User)
  @JoinColumn()
  user: string; //创建者

  @Column()
  groupName: string;

  @Column({ default: '群主很懒,没写公告' })
  notice: string;

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @ManyToMany((type) => User)
  @JoinTable({ name: 'group_user' })
  users: User[]; //群用户
}

@Entity()
export class GroupMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => User)
  @JoinColumn()
  user: User;

  @OneToOne((type) => Group)
  @JoinColumn()
  group: Group;

  @Column()
  content: string;

  @Column()
  messageType: string;

  @Column('double')
  time: number;

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;
}
