import {
  Arg,
  Ctx,
  Query,
  Mutation,
  Resolver,
  UseMiddleware,
  // PubSubEngine,
  // PubSub,
} from "type-graphql";

import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../context";

// ******* entity *******
import { User } from "../entity/User";
import { Profile } from "../entity/Profile";
import { TodoItem } from "../entity/TodoItem";
import { TodoList } from "./../entity/TodoList";

// ******* input *******
import { TodoItemInput } from "../inputs/TodoItem";

@Resolver(TodoItem)
export class TodoItemResolver {
  // ******* querys *******

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

  // Create user todo item for todo list
  @Mutation(() => TodoList)
  @UseMiddleware(isAuth)
  async createTodoItem(
    // @PubSub() pubSub: PubSubEngine,
    @Ctx() { payload }: MyContext,
    @Arg("todoListId") todoListId: number,
    @Arg("itemInfo") todoInfo: TodoItemInput
  ) {
    const user = await User.findOne(payload!.userId);

    if (!user) throw new Error(`could not find user by ${payload!.userId}`);

    const profile = await Profile.findOne(user!.profile.id);

    if (!profile)
      throw new Error(`could not find user profile by ${user!.profile.id}`);

    let todoList = await TodoList.find({
      where: {
        profile: {
          id: user!.profile.id,
        },
      },
      relations: ["items"],
    })
      .then((res) => {
        return res.find((t) => {
          return t.id === todoListId;
        });
      })
      .catch((err) => {
        throw new Error(`something went wrong: ${err}`);
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

  // Delete user todo items in todo list
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteTodoItem(
    // @PubSub() pubSub: PubSubEngine,
    @Ctx() { payload }: MyContext,
    @Arg("todoListId") todoListId: number,
    @Arg("id", () => [Number]) id: number[]
  ) {
    const user = await User.findOne(payload!.userId);

    if (!user) throw new Error(`could not find user by ${payload!.userId}`);

    const profile = await Profile.findOne(user!.profile.id);

    if (!profile)
      throw new Error(`could not find user profile by ${user!.profile.id}`);

    const todoList = await TodoList.find({
      where: {
        profile: {
          id: user!.profile.id,
        },
      },
      relations: ["items"],
    })
      .then((res) => {
        return res.find((t) => {
          return t.id === todoListId;
        });
      })
      .catch((err) => {
        throw new Error(`something went wrong: ${err}`);
      });

    if (!todoList) throw new Error(`could not find todo list by ${todoListId}`);

    const idToDelete: number[] = [];

    todoList.items.map((item) => {
      if (id.includes(item.id)) idToDelete.push(item.id);
    });

    if (idToDelete.length <= 0)
      throw new Error(
        `user haven't todo items in todo list id: ${todoListId}, with items id: ${id}`
      );
    else
      console.log(
        `delete items with id: ${idToDelete} from origin: ${id} in todo list id: ${todoListId}`
      );

    try {
      await TodoItem.delete(idToDelete);
    } catch (error) {
      throw new Error(`can't delete todo list items Error: ${error}`);
    }

    return true;
  }

  // Reorder user todo items in todo list
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async reorderTodoItem(
    // @PubSub() pubSub: PubSubEngine,
    @Ctx() { payload }: MyContext,
    @Arg("todoListId") todoListId: number,
    @Arg("reorderTodoItems") reorderTodoItems: any[]
  ) {
    const user = await User.findOne(payload!.userId);

    if (!user) throw new Error(`could not find user by ${payload!.userId}`);

    const profile = await Profile.findOne(user!.profile.id);

    if (!profile)
      throw new Error(`could not find user profile by ${user!.profile.id}`);

    const todoList = await TodoList.find({
      where: {
        profile: {
          id: user!.profile.id,
        },
      },
      relations: ["items"],
    })
      .then((res) => {
        return res.find((t) => {
          return t.id === todoListId;
        });
      })
      .catch((err) => {
        throw new Error(`something went wrong: ${err}`);
      });

    if (!todoList) throw new Error(`could not find todo list by ${todoListId}`);

    reorderTodoItems.map(async item => {
      try {
        await TodoItem.update(item.id, { sortID: item.sort });
      } catch (error) {
        throw new Error(`can't delete todo list items Error: ${error}`);
      }
    })

    return true;
  }

  // Reorder user one todo item in todo list
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async reorderOneTodoItem(
    // @PubSub() pubSub: PubSubEngine,
    @Ctx() { payload }: MyContext,
    @Arg("todoListId", () => Number) todoListId: number,
    @Arg("reorderTodoItems", () => Number) reorderTodoItemId: number,
    @Arg("reorderTodoItems", () => Number) reorderTodoItemSortId: number
  ) {
    const user = await User.findOne(payload!.userId);

    if (!user) throw new Error(`could not find user by ${payload!.userId}`);

    const profile = await Profile.findOne(user!.profile.id);

    if (!profile)
      throw new Error(`could not find user profile by ${user!.profile.id}`);

    const todoList = await TodoList.find({
      where: {
        profile: {
          id: user!.profile.id,
        },
      },
      relations: ["items"],
    })
      .then((res) => {
        return res.find((t) => {
          return t.id === todoListId;
        });
      })
      .catch((err) => {
        throw new Error(`something went wrong: ${err}`);
      });

    if (!todoList) throw new Error(`could not find todo list by ${todoListId}`);

    const todoItem = await TodoItem.findOne(reorderTodoItemId);
    const saveTodoItemSortId = todoItem!.sortID;
    const findTodoItemBySortId = todoList.items.find(t => t.sortID  === saveTodoItemSortId)!.id;

    await TodoItem.update(findTodoItemBySortId, { sortID: saveTodoItemSortId });
    await TodoItem.update(reorderTodoItemId, { sortID: reorderTodoItemSortId });

    return true;
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
