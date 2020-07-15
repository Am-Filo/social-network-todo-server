import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

import { Settings, User, TodoList } from "../entity";

@ObjectType()
@Entity("profile")
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("text", { nullable: true, default: "newuser" })
  name: string;

  @Field(() => String)
  @Column("text", { nullable: true, default: "avatar-placeholder.png" })
  picture: string;

  @Field(() => Settings)
  @OneToOne(() => Settings, (settings) => settings.profile)
  @JoinColumn()
  settings: Settings;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @Field(() => TodoList)
  @OneToOne(() => TodoList)
  todos: [TodoList];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
