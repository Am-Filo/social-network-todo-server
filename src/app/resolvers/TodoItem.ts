import { TodoList } from "./../entity/TodoList";
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

// ******* entity *******
import { TodoItem } from "../entity/TodoItem";

// ******* inputs *******
import { TodoItemInput } from "../inputs/TodoItem";

@Resolver(TodoItem)
export class TodoItemResolver {
  // ******* querys *******

  // Fetch all todo items
  @Query(() => [TodoItem])
  todoItems() {
    return TodoItem.find({
      relations: ["list"],
    });
  }

  // Fetch all user todo items
  @Query(() => [TodoItem])
  @UseMiddleware(isAuth)
  userTodoItems(@Ctx() { payload }: MyContext) {
    return TodoItem.find({
      where: { id: payload!.userId },
      relations: ["list"],
    });
  }

  // ******* mutations *******

  @Mutation(() => TodoList)
  @UseMiddleware(isAuth)
  async createTodoItem(
    @Arg("todoListId") todoListId: number,
    @Arg("itemInfo") todoInfo: TodoItemInput
  ) {
    let todoList = await TodoList.findOne(todoListId, {
      relations: ["items"],
    });

    if (!todoList) throw new Error(`could not find todo list by ${todoListId}`);

    const todoItem = new TodoItem();
    todoItem.sortID = 0;
    todoItem.title = todoInfo.title;
    todoItem.text = todoInfo.text;
    todoItem.list = todoList;

    try {
      await todoItem.save();
    } catch (err) {
      console.log(err);
      return false;
    }

    todoList = await TodoList.findOne(todoListId, {
      relations: ["items"],
    });

    return todoList;
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
