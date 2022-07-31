import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hashSync } from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { FriendMessage } from 'src/friend/entities/friend.entity';
@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  username: string; // 用户名

  @Column({ length: 100 })
  nickname: string; //昵称

  @Column({ select: false })
  @Exclude()
  password: string; // 密码

  @Column({ default: 'defaultAvatar.jpg' })
  avatar: string; //头像

  @Column()
  email: string;

  @Column('simple-enum', { default: 'user', enum: ['root', 'user', 'visitor'] })
  @Exclude()
  role: string; // 用户角色

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

  @BeforeInsert()
  async encryptPwd() {
    this.password = await hashSync(this.password);
  }

  @ManyToMany((type) => User)
  @JoinTable({
    name: 'friend',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'friendId',
      referencedColumnName: 'id',
    },
  })
  friend: User[];

  friendMessages: FriendMessage[];
}
