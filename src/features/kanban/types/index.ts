export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export interface Task {
  id: Id;
  status: string;
  title: string;
}
