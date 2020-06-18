// import { MyContext } from "./../../context/index";
import { isAuth } from "./../../middleware/isAuth";
import {
  Arg,
  Query,
  Resolver,
  Mutation,
  UseMiddleware,
  // Ctx,
} from "type-graphql";

import { Todo } from "../entity";

@Resolver()
export class TodoResolver {
  @Query(() => [Todo])
  todos() {
    return Todo.find();
  }

  @Mutation(() => Todo)
  @UseMiddleware(isAuth)
  async addTodo(
    // @Ctx() { payload }: MyContext,
    @Arg("text") text: string,
    @Arg("complete") complete: boolean
  ) {
    let todoID: any;
    let todo: any;

    try {
      await Todo.insert({
        text: text,
        complete: complete,
        // authorId: payload?.userId,
      }).then((res) => (todoID = res.raw[0].id));
    } catch (err) {
      console.log(err);
      return false;
    }

    todo = await Todo.findOne({ where: { id: todoID } });

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
//     // .limit(limit).skip(skip);
//   }
// }
