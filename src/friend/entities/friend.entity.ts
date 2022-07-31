import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class FriendMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'friendId', referencedColumnName: 'id' })
  friend: User;

  @Column()
  friendId: string;

  @Column()
  content: string;

  @Column()
  messageType: string;

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;
}
