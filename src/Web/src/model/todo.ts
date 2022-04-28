export interface ITodo {
  userId: number;
  id: string;
  title: string;
  completed: boolean;
  isChanging: boolean;
  local: boolean;
}
