import {
  Resolver,
  Query,
  Mutation,
  UseMiddleware,
  Arg,
  Ctx,
} from "type-graphql";

import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../context";

// ******* entity *******
import { User } from "../entity/User";
import { Profile } from "../entity/Profile";
import { TodoList } from "../entity/TodoList";

// ******* inputs *******
import { TodoListInput } from "../inputs/TodoList";

@Resolver(TodoList)
export class TodoListResolver {
  // ******* querys *******

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
  async userTodoLists(@Ctx() { payload }: MyContext) {
    const user = await User.findOne(payload!.userId, {
      relations: ["profile"],
    });

    return await Profile.findOne(user!.profile.id, {
      relations: ["todos"],
    });
  }

  // ******* mutations *******

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
    todoList.title = todoInfo.title;
    todoList.text = todoInfo.text;
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
