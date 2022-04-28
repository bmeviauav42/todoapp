import { ITodo } from "./todo";

export interface ISearchTodoResponse {
  items: ITodo[];
  count: number;
}
