import {
  InsertEvent,
  EventSubscriber,
  EntitySubscriberInterface,
} from "typeorm";

// entity
import { User } from "../entity/User";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<[User]> {
  listenTo() {
    return User;
  }

  afterInsert(event: InsertEvent<[User]>) {
    console.log(event);
  }
}
