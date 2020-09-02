import {
  Entity,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Int, Field, ObjectType } from "type-graphql";

// ******* entity *******
import { TodoList } from "../todo-list/todo-list.entity";

@Entity("todoItem")
@ObjectType()
export class TodoItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column("int")
  @Field(() => Int)
  sortID: number;

  @Column("text", { default: "New task...", nullable: false })
  @Field(() => String)
  title: string;

  @Column("text", { nullable: true })
  @Field(() => String)
  text: string;

  @Column("boolean", { default: false })
  @Field(() => Boolean)
  complete: boolean;

  @ManyToOne(() => TodoList, (todoList) => todoList.items)
  @Field(() => TodoList)
  list: TodoList;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
