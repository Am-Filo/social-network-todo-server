import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Int, Field, ObjectType } from "type-graphql";

// ******* entity *******
import { Profile } from "./Profile";
import { TodoItem } from "./TodoItem";

@Entity("todoList")
@ObjectType()
export class TodoList extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column("int")
  @Field(() => Int)
  sortID: number;

  @Column("text", { default: "new todo list", nullable: false })
  @Field(() => String)
  title: string;

  @Column("text", { nullable: true })
  @Field(() => String)
  text: string;

  @ManyToOne(() => Profile, (profile) => profile.todos)
  @Field(() => Profile)
  profile: Profile;

  @OneToMany(() => TodoItem, (todoItem) => todoItem.list, {
    eager: true,
    cascade: true,
  })
  @Field(() => [TodoItem])
  items: TodoItem[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
