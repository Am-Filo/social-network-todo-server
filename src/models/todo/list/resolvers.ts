import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity("todoItem")
export class Todo extends BaseEntity {

  title: String!
  todos: [Todo] @relation

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("text")
  text: string;

  @Field(() => Boolean)
  @Column("boolean")
  complete: boolean;

  @Field(() => Int)
  authorId: number;

  title: !String;
  completed: !Boolean;
  list: List;
}
