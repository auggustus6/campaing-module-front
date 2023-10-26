import { User } from "./user";

export interface Company {
  id: string;
  name: string;
  isActive: boolean;

  owner: User;

  createdAt: string;
  updatedAt: string;
}
