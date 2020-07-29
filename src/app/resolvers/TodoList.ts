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
import { Profile } from "../entity/Profile";

import { TodoListInput } from "../inputs/TodoList";
import { User } from "../entity/User";

@Resolver(TodoList)
export class TodoListResolver {
  /*
    Querys
  */

  // Fetch all todolists
  @Query(() => [TodoList])
  todoLists() {
    return TodoList.find({
      relations: ["items", "profile"],
    });
  }

  // Fetch all user todolists
  @Query(() => Profile)
  @UseMiddleware(isAuth)
  userTodoLists(@Ctx() { payload }: MyContext) {
    return Profile.findOne(payload!.userId, {
      relations: ["todos", "todos.items"],
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

  // new createTodoList

  @Mutation(() => Profile)
  @UseMiddleware(isAuth)
  async createTodoList(
    @Ctx() { payload }: MyContext,
    @Arg("todoInfo") todoInfo: TodoListInput
  ) {
    const user = await User.findOne(payload!.userId, {
      relations: ["profile"],
    });

    let profile = await Profile.findOne(user!.profile.id, {
      relations: ["user", "settings", "todos"],
    });

    if (!profile) throw new Error(`could not find user by ${payload!.userId}`);

    const todoList = new TodoList();
    todoList.sortID = 0;
    todoList.text = todoInfo.text;
    todoList.title = todoInfo.text;
    todoList.profile = profile;

    try {
      await todoList.save();
    } catch (err) {
      console.log(err);
      return false;
    }

    profile = await Profile.findOne(user!.profile.id, {
      relations: ["user", "settings", "todos", "todos.items"],
    });

    return profile;
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
