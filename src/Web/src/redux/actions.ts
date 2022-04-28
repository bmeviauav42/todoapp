import fetch from "cross-fetch";
import { Dispatch } from "react";
import { ITodo } from "../model/todo";
import { IUser } from "../model/user";
import { ISearchTodoResponse } from "../model/searchTodoResponse";

export const REQUEST_USERS = "REQUEST_USERS";
function requestUsers(): IRequestUsersAction {
  return {
    type: REQUEST_USERS
  };
}
interface IRequestUsersAction {
  type: typeof REQUEST_USERS;
}

export const RECEIVE_USERS = "RECEIVE_USERS";
function receiveUsers(users: IUser[]): IReceiveUserAction {
  return {
    receivedAt: new Date(),
    users,
    type: RECEIVE_USERS
  };
}
interface IReceiveUserAction {
  type: typeof RECEIVE_USERS;
  users: IUser[];
  receivedAt: Date;
}

export const REQUEST_TODOS = "REQUEST_TODOS";
function requestTodos(): IRequestTodosAction {
  return {
    type: REQUEST_TODOS
  };
}
interface IRequestTodosAction {
  type: typeof REQUEST_TODOS;
}

export const RECEIVE_TODOS = "RECEIVE_TODOS";
function receiveTodos(response: ISearchTodoResponse): IReceiveTodoAction {
  return {
    receivedAt: new Date(),
    todos: response.items,
    todoCount: response.count,
    type: RECEIVE_TODOS
  };
}
interface IReceiveTodoAction {
  type: typeof RECEIVE_TODOS;
  todos: ITodo[];
  todoCount: number;
  receivedAt: Date;
}

export const SHOW_SEARCH_TODO_MODAL = "SHOW_SEARCH_TODO_MODAL";
export function showSearchTodoModal(): IShowSearchTodoModalAction {
  return {
    type: SHOW_SEARCH_TODO_MODAL
  };
}
interface IShowSearchTodoModalAction {
  type: typeof SHOW_SEARCH_TODO_MODAL;
}

export const CLOSE_SEARCH_TODO_MODAL = "CLOSE_SEARCH_TODO_MODAL";
export function closeSearchTodoModal(): ICloseSearchTodoModalAction {
  return {
    type: CLOSE_SEARCH_TODO_MODAL
  };
}
interface ICloseSearchTodoModalAction {
  type: typeof CLOSE_SEARCH_TODO_MODAL;
}

export const UPDATE_PENDING_SEARCH = "UPDATE_PENDING_SEARCH";
export function updatePendingSearch(
  userId: number | undefined,
  text: string
): IUpdatePendingSearchAction {
  return {
    text,
    type: UPDATE_PENDING_SEARCH,
    userId
  };
}
interface IUpdatePendingSearchAction {
  type: typeof UPDATE_PENDING_SEARCH;
  userId: number | undefined;
  text: string;
}

export const SHOW_ADD_TODO_MODAL = "SHOW_ADD_TODO_MODAL";
export function showAddTodoModal(): IShowAddTodoModalAction {
  return {
    type: SHOW_ADD_TODO_MODAL
  };
}
interface IShowAddTodoModalAction {
  type: typeof SHOW_ADD_TODO_MODAL;
}

export const CLOSE_ADD_TODO_MODAL = "CLOSE_ADD_TODO_MODAL";
export function closeAddTodoModal(): ICloseAddTodoModalAction {
  return {
    type: CLOSE_ADD_TODO_MODAL
  };
}
interface ICloseAddTodoModalAction {
  type: typeof CLOSE_ADD_TODO_MODAL;
}

export const UPDATE_PENDING_TODO = "UPDATE_PENDING_TODO";
export function updatePendingTodo(
  userId: number,
  title: string
): IUpdatePendingTodoAction {
  return {
    title,
    type: UPDATE_PENDING_TODO,
    userId
  };
}
interface IUpdatePendingTodoAction {
  type: typeof UPDATE_PENDING_TODO;
  userId: number;
  title: string;
}

export const START_POST_TODO = "START_POST_TODO";
function startPostTodo(): IStartPostTodoAction {
  return {
    type: START_POST_TODO
  };
}
interface IStartPostTodoAction {
  type: typeof START_POST_TODO;
}

export const END_POST_TODO = "END_POST_TODO";
function endPostTodo(todo: ITodo): IEndPostTodoAction {
  return {
    todo,
    type: END_POST_TODO
  };
}
interface IEndPostTodoAction {
  type: typeof END_POST_TODO;
  todo: ITodo;
}

export const START_MODIFY_TODO = "START_MODIFY_TODO";
function startModifyTodo(id: string): IStartModifyTodoAction {
  return {
    id,
    type: START_MODIFY_TODO
  };
}
interface IStartModifyTodoAction {
  type: typeof START_MODIFY_TODO;
  id: string;
}

export const END_MODIFY_TODO = "END_MODIFY_TODO";
function endModifyTodo(todo: ITodo): IEndModifyTodoAction {
  return {
    todo,
    type: END_MODIFY_TODO
  };
}
interface IEndModifyTodoAction {
  type: typeof END_MODIFY_TODO;
  todo: ITodo;
}

export const END_DELETE_TODO = "END_DELETE_TODO";
function endDeleteTodo(id: string): IEndDeleteTodoAction {
  return {
    id,
    type: END_DELETE_TODO
  };
}
interface IEndDeleteTodoAction {
  type: typeof END_DELETE_TODO;
  id: string;
}

export type ITodoAction =
  | IRequestUsersAction
  | IReceiveUserAction
  | IRequestTodosAction
  | IReceiveTodoAction
  | IShowSearchTodoModalAction
  | ICloseSearchTodoModalAction
  | IUpdatePendingSearchAction
  | IShowAddTodoModalAction
  | ICloseAddTodoModalAction
  | IUpdatePendingTodoAction
  | IStartPostTodoAction
  | IEndPostTodoAction
  | IStartModifyTodoAction
  | IEndModifyTodoAction
  | IEndDeleteTodoAction;

// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchPosts('reactjs'))

export function fetchUsers() {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return (dispatch: Dispatch<ITodoAction>) => {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestUsers());

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch(`/api/users`)
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => console.log("An error occurred.", error)
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(receiveUsers(json))
      );
  };
}

export function fetchTodos(
  userId: number | undefined,
  searchExpression: string | undefined
) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return (dispatch: Dispatch<ITodoAction>) => {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestTodos());

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    var queryString = "/api/todos";
    if (userId && searchExpression) {
      queryString =
        queryString +
        `?userId=${encodeURIComponent(
          userId.toString()
        )}&searchExpression=${encodeURIComponent(searchExpression)}`;
    } else if (userId) {
      queryString =
        queryString + `?userId=${encodeURIComponent(userId.toString())}`;
    } else if (searchExpression) {
      queryString =
        queryString +
        `?searchExpression=${encodeURIComponent(searchExpression)}`;
    }

    return fetch(queryString)
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => console.log("An error occurred.", error)
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(receiveTodos(json))
      );
  };
}

export function postTodo(todo: ITodo) {
  return (dispatch: Dispatch<ITodoAction>) => {
    dispatch(startPostTodo());

    return fetch("/api/todos", {
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      method: "POST"
    })
      .then(response => response.json())
      .then(json => dispatch(endPostTodo(json)));
  };
}

export function modifyTodo(todo: ITodo) {
  return (dispatch: Dispatch<ITodoAction>) => {
    dispatch(startModifyTodo(todo.id));

    if (todo.local) {
      return new Promise(resolve => setTimeout(resolve, 1000)).then(() =>
        dispatch(endModifyTodo(todo))
      );
    } else {
      return fetch(`/api/todos/${todo.id}`, {
        body: JSON.stringify(todo),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        method: "PUT"
      })
        .then(response => response.json())
        .then(json =>
          dispatch(
            endModifyTodo({
              ...json,
              local: todo.local
            })
          )
        );
    }
  };
}

export function deleteTodo(id: string) {
  return (dispatch: Dispatch<ITodoAction>) => {
    dispatch(startModifyTodo(id));

    return fetch(`/api/todos/${id}`, {
      method: "DELETE"
    }).then(() => dispatch(endDeleteTodo(id)));
  };
}
