import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => User)
  @JoinColumn()
  user: User; //创建者

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

  @ManyToMany(() => User)
  @JoinTable({ name: 'group_user' })
  users: User[]; //群用户

  @OneToMany(() => GroupMessage, (GroupMessage) => GroupMessage.group)
  groupMessages: GroupMessage[];
}

@Entity()
export class GroupMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
  @Column()
  userId: string;

  @ManyToOne(() => Group, (group) => group.groupMessages)
  @JoinColumn()
  group: Group;

  @Column()
  content: string;

  @Column({ default: 'text' })
  messageType: string;

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;
}
