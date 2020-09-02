import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  BaseEntity,
  // BeforeInsert,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";

// ******* entity *******
import { User } from "../user/user.entity";
import { Settings } from "../settings/settings.entity";
import { TodoList } from "../todo-list/todo-list.entity";

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
    eager: true,
    cascade: true,
  })
  @Field(() => Settings)
  @JoinColumn()
  settings: Settings;

  @OneToOne(() => User, (user) => user.profile)
  @Field(() => User)
  user: User;

  @OneToMany(() => TodoList, (todos) => todos.profile, {
    eager: true,
    cascade: true,
  })
  @Field(() => [TodoList])
  todos: TodoList[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  // @BeforeInsert()
  // addId() {
  //   this.name = "user_" + new Date().getTime();
  // }
}
