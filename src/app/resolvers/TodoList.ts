import {
  Resolver,
  Query,
  Mutation,
  UseMiddleware,
  Arg,
  Ctx,
} from "type-graphql";

import { MyContext } from "../context";
import { isAuth } from "../../middleware/isAuth";

// entity
import { TodoItem } from "../entity/TodoItem";
import { TodoList } from "../entity/TodoList";

@Resolver(TodoList)
export class TodoListResolver {
  /*
    Querys
  */

  // Fetch all todolists
  @Query(() => [TodoList])
  todoLists() {
    return TodoList.find({
      relations: ["list"],
    });
  }

  // Fetch all user todolists
  @Query(() => [TodoList])
  @UseMiddleware(isAuth)
  userTodoLists(@Ctx() { payload }: MyContext) {
    return TodoList.find({
      where: { id: payload!.userId },
      relations: ["list"],
    });
  }

  /*
    Mutations
  */

  @Mutation(() => TodoItem)
  @UseMiddleware(isAuth)
  async addTodo(
    // @Ctx() { payload }: MyContext,
    @Arg("text") text: string,
    @Arg("complete") complete: boolean
  ) {
    let todoID: any;
    let todo: any;
    try {
      await TodoItem.insert({
        text,
        complete,
        // authorId: payload?.userId,
      }).then((res) => (todoID = res.raw[0].id));
    } catch (err) {
      console.log(err);
      return false;
    }
    todo = await TodoItem.findOne({ where: { id: todoID } });
    return todo;
  }
}
// @Service()
// export class PostService {
//   getPosts({ filter, limit, skip = 0 }: TodosArgs): Promise<Todo[]> {
//     const criteria: any = {};
//     if (filter) {
//       if (filter.createdAtMin) {
//         criteria.createdAt = { $gt: filter.createdAtMin };
//       }
//       if (filter.completed) {
//         criteria.complete = { $gt: filter.completed };
//       }
//       if (filter.authorId) {
//         criteria.authorId = filter.authorId;
//       }
//     }
//     return Todo.find(criteria);
// .limit(limit).skip(skip);
//   }
// }
