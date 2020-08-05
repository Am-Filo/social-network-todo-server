import { Field, InputType } from "type-graphql";

@InputType("todoList")
export class TodoListInput {
  @Field({ nullable: true, defaultValue: 0 })
  sortID: number;

  @Field({ nullable: true, defaultValue: "New Todo List" })
  title?: string;

  @Field({
    nullable: true,
    defaultValue: "Write something about this list here",
  })
  text?: string;

  @Field(() => Boolean, { nullable: true })
  private?: boolean;
}
