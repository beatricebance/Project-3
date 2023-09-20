export enum STATUS {
  Online = "Online",
  Collaborating = "Collaborating",
  Offline = "Offline",
}

export interface UserStatus {
  user: string;
  status: STATUS;
}
