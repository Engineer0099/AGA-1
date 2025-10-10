import * as aprn from "react-native-appwrite";

const client = new aprn.Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("68ca4989003b47647dea");

export const account = new aprn.Account(client);
export const databases = new aprn.Databases(client);
export const storage = new aprn.Storage(client);
