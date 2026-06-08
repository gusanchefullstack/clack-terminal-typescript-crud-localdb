import {
  autocomplete,
  intro,
  outro,
  text,
  select,
  confirm,
  group,
  log,
  tasks,
  spinner,
  isCancel,
  password,
} from "@clack/prompts";
import { v4 as uuidv4 } from "uuid";
import { User } from "./user.js";
import { UserCollection } from "./userCollection.js";

let seed = [
  new User(
    uuidv4(),
    "Gustavo",
    "Sanchez",
    "gusanche",
    "1234",
    "gusanche@gmail.com",
    "9546667876",
    true,
  ),
  new User(
    uuidv4(),
    "Maria",
    "Paz",
    "mariapaz",
    "1234",
    "mariapaz@gmail.com",
    "9546767878",
    false,
  ),
  new User(
    uuidv4(),
    "Carlos",
    "Rivera",
    "crivera",
    "password1",
    "crivera@gmail.com",
    "3125559201",
    true,
  ),
  new User(
    uuidv4(),
    "Ana",
    "Lopez",
    "alopez",
    "securepass",
    "alopez@gmail.com",
    "4155559374",
    true,
  ),
  new User(
    uuidv4(),
    "Luis",
    "Martinez",
    "lmartinez",
    "pass1234",
    "lmartinez@gmail.com",
    "6505558812",
    false,
  ),
  new User(
    uuidv4(),
    "Sofia",
    "Gomez",
    "sgomez",
    "mypassword",
    "sgomez@gmail.com",
    "7135557643",
    true,
  ),
  new User(
    uuidv4(),
    "Diego",
    "Torres",
    "dtorres",
    "qwerty123",
    "dtorres@gmail.com",
    "2815556029",
    true,
  ),
  new User(
    uuidv4(),
    "Valentina",
    "Reyes",
    "vreyes",
    "hello1234",
    "vreyes@gmail.com",
    "8325554817",
    false,
  ),
  new User(
    uuidv4(),
    "Andres",
    "Castillo",
    "acastillo",
    "abc12345",
    "acastillo@gmail.com",
    "3055553291",
    true,
  ),
  new User(
    uuidv4(),
    "Camila",
    "Herrera",
    "cherrera",
    "pass5678",
    "cherrera@gmail.com",
    "9545551748",
    true,
  ),
];

let collection: UserCollection = new UserCollection("UserDb", seed);

async function mainMenu() {
  intro("Welcome to the Users CRUD App");
  while (true) {
    const crudOption = await select({
      message: "What would you like to do?",
      options: [
        {
          value: "createUser",
          label: "Create new user",
          hint: "Add new user to database",
        },
        {
          value: "listUsers",
          label: "List all users",
          hint: "List all users in database",
        },
        {
          value: "getUser",
          label: "Get user",
          hint: "Get single user details",
        },
        {
          value: "updateUserStatus",
          label: "Update user status",
          hint: "Update user status field",
        },
        {
          value: "deleteuser",
          label: "Delete user",
          hint: "Delete user from database",
        },
        { value: "exit", label: "Exit", hint: "Exit application" },
      ],
    });
    if (isCancel(crudOption)) {
      console.log("Operation cancelled");
      process.exit(0);
    }
    if (crudOption === "exit") {
      outro("All operations completed...Goodbye!");
      break;
    }
    switch (crudOption) {
      case "createUser": {
            const user = await createUserFlow();
            collection.addUser(user!.firstname, user!.lastname, user!.username, user!.password, user!.email, user!.phone)
        break;
      }
      case "listUsers": {
        await listUsersFlow();
        break;
      }
      case "getUser": {
        await getSingleUserDetails();
        break;
      }
      case "updateUserStatus": {
        await updateUserStatusFlow();
        break;
      }
      case "deleteuser": {
        await deleteUserFlow();
        break;
      }
    }
  }
}

async function createUserFlow() {
  // group() bundles all prompts together.
  // The `onCancel` callback runs when the user hits Ctrl+C on ANY field.
  try {
    let user = await group(
      {
        firstname: () => text({ message: "First name:", placeholder: "John" }),

        lastname: () => text({ message: "Last name:", placeholder: "Doe" }),

        username: () =>
          text({
            message: "Username:",
            validate: (v = "") =>
              v.length < 3 ? "Min 3 characters" : undefined,
          }),

        password: () =>
          password({
            message: "Password:",
            validate: (v = "") =>
              v.length < 8 ? "Min 8 characters" : undefined,
          }),

        email: () =>
          text({
            message: "Email:",
            placeholder: "john@example.com",
            validate: (v) =>
              !v?.includes("@") ? "Enter a valid email" : undefined,
          }),

        phone: () =>
          text({ message: "Phone:", placeholder: "+1 555 000 0000" }),
      },
      {
        onCancel() {
          throw new Error("cancelled");
        },
      },
    );
    return user;
  } catch {
    log.warn("User creation cancelled. Returning to main menu.");
    return;
  }
}

async function listUsersFlow() {
  const spin = spinner();
  spin.start("Fetching users...");
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 3000));

  spin.stop("Users fetched successfully");

  console.log(
    `\n\tCollection: ${collection.name} || Total Users: ${collection.getItemCount().totalUsers} || Active Users: ${collection.getItemCount().activeUsers} || Suspended Users: ${collection.getItemCount().suspendedUsers}`,
  );

  collection.getUsers().forEach((item) => item.printDetails());
}

async function getSingleUserDetails() {
  const spin = spinner();
  spin.start("Fetching users...");
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));
  spin.stop("Users fetched successfully");
  const users = collection.getUsers();
  const formatedUser = users.map((user) => ({
    value: user.id,
    label: user.username,
    hint: `${user.firstname} ${user.lastName}`,
  }));
  const selectedUser = await autocomplete({
    message: "Search for a user:",
    options: formatedUser,
    placeholder: "Type to search...",
    maxItems: 20,
  });

  if (isCancel(selectedUser)) {
    console.log("Operation cancelled");
    return;
  }

  collection.getUserById(selectedUser)?.printDetails();
}

async function updateUserStatusFlow() {
  const spin = spinner();
  spin.start("Fetching users...");
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));
  spin.stop("Users fetched successfully");
  const users = collection.getUsers();
  const formatedUser = users.map((user) => ({
    value: user.id,
    label: user.username,
    hint: `${user.firstname} ${user.lastName}`,
  }));
  const selectedUser = await autocomplete({
    message: "Search for a user:",
    options: formatedUser,
    placeholder: "Type to search...",
    maxItems: 20,
  });

  const status = await select({
    message: "Select status:",
    options: [
      { value: "active", label: "Active", hint: "Activate user" },
      { value: "suspended", label: "Suspended", hint: "Suspend user" },
    ],
  });

  if (isCancel(status)) {
    console.log("Operation cancelled");
    return;
  }
  if (selectedUser) {
    switch (status) {
      case "active":
        collection.updateUserStatus(selectedUser as string, true);
        console.log("Status set to Active");
        break;

      case "suspended":
        collection.updateUserStatus(selectedUser as string, false);
        console.log("Status set to Suspended");
        break;
    }
  }
}

async function deleteUserFlow() {
  const spin = spinner();
  spin.start("Fetching users...");
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));
  spin.stop("Users fetched successfully");
  const users = collection.getUsers();
  const formatedUser = users.map((user) => ({
    value: user.id,
    label: user.username,
    hint: `${user.firstname} ${user.lastName}`,
  }));
  const selectedUser = await autocomplete({
    message: "Search for a user:",
    options: formatedUser,
    placeholder: "Type to search...",
    maxItems: 20,
  });

  if (isCancel(selectedUser)) {
    console.log("Operation cancelled");
    return;
  }

  collection.deleteUser(selectedUser) == "Deleted"
    ? console.log("\tUser deleted")
    : console.log("\tError");
}

mainMenu();
