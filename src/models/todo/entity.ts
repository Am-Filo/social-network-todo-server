import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity("todo")
export class Todo extends BaseEntity {
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
}

// @InputType()
// export class TodosFilterInput {
//   @Field({ nullable: true })
//   createdAtMin: Date;

//   @Field(() => Boolean, { nullable: true })
//   completed?: boolean;

//   @Field(() => ID, { nullable: true })
//   authorId?: number;

//   @Field(() => ID, { nullable: true })
//   reviewerId?: string;
// }

// @ArgsType()
// export class TodosArgs {
//   @Field(() => Int, { nullable: true })
//   limit = 10;

//   @Field(() => Int, { nullable: true })
//   skip?: number;

//   @Field()
//   filter: TodosFilterInput;
// }
