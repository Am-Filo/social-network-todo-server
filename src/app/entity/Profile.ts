import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
} from "typeorm";

import { User } from "./User";
import { Settings } from "./Settings";
import { TodoList } from "./TodoList";

@Entity("profile")
@ObjectType()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false })
  @Field(() => String)
  name: string;

  @Column("text", { nullable: false, default: "img-placeholder.png" })
  @Field(() => String)
  picture: string;

  @OneToOne(() => Settings, (settings) => settings.profile, {
    cascade: ["update"],
  })
  @Field(() => Settings)
  @JoinColumn()
  settings: Settings;

  @OneToOne(() => User, (user) => user.profile)
  @Field(() => User)
  user: User;

  @OneToMany(() => TodoList, (todos) => todos.list, {
    lazy: true,
    cascade: ["update", "remove"],
  })
  @Field(() => [TodoList])
  todos: [TodoList];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @BeforeInsert()
  addId() {
    this.name = "user_" + new Date().getTime();
  }
}
