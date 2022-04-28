import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import thunkMiddleware, { ThunkMiddleware } from "redux-thunk";
import { fetchTodos, ITodoAction, fetchUsers } from "./actions";
import { ITodoState, todos } from "./reducer";

export const store = createStore(
  todos,
  applyMiddleware(
    thunkMiddleware as ThunkMiddleware<ITodoState, ITodoAction>, // lets us dispatch() functions
    logger // neat middleware that logs actions
  )
);

store.dispatch(fetchTodos(undefined, undefined));
store.dispatch(fetchUsers());
