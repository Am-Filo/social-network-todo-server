import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { TodoList } from "../../../models/entity";

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

  @Field(() => TodoList)
  list: TodoList;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
