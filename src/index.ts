import { v4 as uuidv4 } from "uuid";
import { User } from "./user.js";
import { UserCollection } from "./userCollection.js";

let seed = [
    new User(uuidv4(), "Gustavo", "Sanchez", "gusanche", "1234", "gusanche@gmail.com", "9546667876", true),
    new User(uuidv4(), "Maria", "Paz", "mariapaz", "1234", "mariapaz@gmail.com", "9546767878", false)
];

let collection: UserCollection = new UserCollection("UserDb", seed);

console.log(`Collection: ${collection.name} || Total Users: ${collection.getItemCount().totalUsers} || Active Users: ${collection.getItemCount().activeUsers} || Suspended Users: ${collection.getItemCount().suspendedUsers}`)
collection.getUsers().forEach(item => item.printDetails());
