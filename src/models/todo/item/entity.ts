import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { TodoList } from "../../../models/entity";

@ObjectType()
@Entity("todoItem")
export class TodoItem extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column("int")
  sortID: number;

  @Field(() => String)
  @Column("text", { default: "New task...", nullable: false })
  title: string;

  @Field(() => String)
  @Column("text", { nullable: true })
  text: string;

  @Field(() => Boolean)
  @Column("boolean", { default: false })
  complete: boolean;

  @Field(() => TodoList)
  list: TodoList;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
