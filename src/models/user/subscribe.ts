import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { User } from "./entity";

@EventSubscriber()
export class PersonSubscriber implements EntitySubscriberInterface<[User]> {
  listenTo() {
    return User;
  }

  afterInsert(event: InsertEvent<[User]>) {
    console.log(event);
  }
}
