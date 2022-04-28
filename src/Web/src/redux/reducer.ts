import { ITodo } from "../model/todo";
import {
  CLOSE_ADD_TODO_MODAL,
  END_POST_TODO,
  ITodoAction,
  RECEIVE_TODOS,
  REQUEST_TODOS,
  RECEIVE_USERS,
  REQUEST_USERS,
  SHOW_ADD_TODO_MODAL,
  START_POST_TODO,
  UPDATE_PENDING_TODO,
  START_MODIFY_TODO,
  END_MODIFY_TODO,
  END_DELETE_TODO,
  SHOW_SEARCH_TODO_MODAL,
  CLOSE_SEARCH_TODO_MODAL,
  UPDATE_PENDING_SEARCH
} from "./actions";
import { IUser } from "../model/user";

export interface ITodoState {
  isFetchingTodos: boolean;
  isFetchingUsers: boolean;
  lastUpdated: Date;
  todos: ITodo[];
  todoCount: number;
  users: IUser[];
  showAddTodoModal: boolean;
  showSearchTodoModal: boolean;
  pendingTodo: ITodo;
  searchUserId: number | undefined;
  searchText: string;
}

const emptyPendingTodo = {
  completed: false,
  id: "",
  isChanging: false,
  local: false,
  title: "",
  userId: 1
};

const initialState = {
  isFetchingTodos: false,
  isFetchingUsers: false,
  lastUpdated: new Date(0),
  pendingTodo: emptyPendingTodo,
  showAddTodoModal: false,
  showSearchTodoModal: false,
  todos: [],
  todoCount: 0,
  users: [],
  searchUserId: undefined,
  searchText: ""
};

export function todos(state: ITodoState = initialState, action: ITodoAction) {
  switch (action.type) {
    case REQUEST_USERS:
      return {
        ...state,
        isFetchingUsers: true
      };
    case RECEIVE_USERS:
      return {
        ...state,
        isFetchingUsers: false,
        lastUpdated: action.receivedAt,
        users: action.users
      };
    case REQUEST_TODOS:
      return {
        ...state,
        isFetchingTodos: true,
        showSearchTodoModal: false
      };
    case RECEIVE_TODOS:
      return {
        ...state,
        isFetchingTodos: false,
        lastUpdated: action.receivedAt,
        todos: action.todos,
        todoCount: action.todoCount
      };
    case SHOW_SEARCH_TODO_MODAL:
      return {
        ...state,
        showSearchTodoModal: true
      };
    case CLOSE_SEARCH_TODO_MODAL:
      return {
        ...state,
        showSearchTodoModal: false
      };
    case UPDATE_PENDING_SEARCH:
      return {
        ...state,
        searchUserId: action.userId,
        searchText: action.text
      };
    case SHOW_ADD_TODO_MODAL:
      return {
        ...state,
        showAddTodoModal: true
      };
    case CLOSE_ADD_TODO_MODAL:
      return {
        ...state,
        showAddTodoModal: false
      };
    case UPDATE_PENDING_TODO:
      return {
        ...state,
        pendingTodo: {
          ...state.pendingTodo,
          title: action.title,
          userId: action.userId
        }
      };
    case START_POST_TODO:
      return {
        ...state,
        isFetchingTodos: true,
        showAddTodoModal: false
      };
    case END_POST_TODO:
      return {
        ...state,
        isFetchingTodos: false,
        pendingTodo: {
          ...emptyPendingTodo
        },
        todos: state.todos.concat([
          {
            ...action.todo,
            local: true
          }
        ])
      };
    case START_MODIFY_TODO:
      const changingTodo = state.todos.find(todo => todo.id === action.id);
      if (!changingTodo) {
        return state;
      }

      changingTodo.isChanging = true;
      return {
        ...state,
        todos: state.todos
          .filter(todo => todo.id !== action.id)
          .concat([changingTodo])
      };
    case END_MODIFY_TODO:
      return {
        ...state,
        todos: state.todos
          .filter(todo => todo.id !== action.todo.id)
          .concat([{ ...action.todo, isChanging: false }])
      };
    case END_DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id)
      };
    default:
      return state;
  }
}
