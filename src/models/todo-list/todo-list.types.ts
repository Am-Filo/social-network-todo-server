import { Field, ObjectType } from "type-graphql";

// ******* entity *******
import { TodoList } from "./todo-list.entity";

@ObjectType("todoListSubscriber")
export class TodoListSubscriber {
  @Field(() => String)
  type: string;

  @Field(() => [Number], { nullable: true })
  ids: number[];

  @Field(() => Number, { nullable: true })
  id: number;

  @Field(() => TodoList, { nullable: true })
  content: TodoList;
}
