import { Arg, Query, Resolver, Mutation } from "type-graphql";

import { Todo } from "../../utils/entity/entity";

@Resolver()
export class TodoResolver {
  @Query(() => [Todo])
  todos() {
    return Todo.find();
  }

  @Mutation(() => Todo)
  async addTodo(@Arg("text") text: string, @Arg("complete") complete: boolean) {
    let todoID: any;
    let todo: any;

    try {
      await Todo.insert({
        text: text,
        complete: complete,
      }).then((res) => (todoID = res.raw[0].id));
    } catch (err) {
      console.log(err);
      return false;
    }

    todo = await Todo.findOne({ where: { id: todoID } });

    return todo;
  }
}
