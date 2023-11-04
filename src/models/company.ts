import { User } from "./user";

export interface Company {
  id: string;
  name: string;
  isActive: boolean;

  owner: User;

  createdCampaigns: number;

  createdAt: string;
  updatedAt: string;
}
