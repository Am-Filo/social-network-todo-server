import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  CreateDateColumn,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { TodoItem } from "../../../models/entity";

@ObjectType()
@Entity("todoList")
export class TodoList extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column("int")
  sortID: number;

  @Field(() => String)
  @Column("text", { default: "new todo list", nullable: false })
  title: string;

  @Field(() => String)
  @Column("text", { nullable: true })
  text: string;

  @Field(() => TodoItem)
  @OneToOne(() => TodoItem)
  todos: [TodoItem];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
