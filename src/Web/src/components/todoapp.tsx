import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { ITodo } from "../model/todo";
import {
  ITodoAction,
  showAddTodoModal,
  modifyTodo,
  deleteTodo,
  showSearchTodoModal
} from "../redux/actions";
import { ITodoState } from "../redux/reducer";
import AddTodoModal from "./addtodomodal";
import { TodoRow } from "./todorow";
import { IUser } from "../model/user";
import SearchTodoModal from "./searchtodomodal";

interface ITodoAppProps {
  isFetchingTodos: boolean;
  isFetchingUsers: boolean;
  todos: ITodo[];
  todoCount: number;
  users: IUser[];
  dispatch: ThunkDispatch<ITodoState, undefined, ITodoAction>;
}

class TodoApp extends Component<ITodoAppProps> {
  public render() {
    const todos = this.props.todos;

    const todoItems =
      todos &&
      todos.map(todo => (
        <TodoRow
          key={todo.id}
          todo={todo}
          onTodoModified={this.onTodoModified}
          onTodoDeleted={this.onTodoDeleted}
        />
      ));

    const addButtonContent = this.props.isFetchingTodos ? (
      <div>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        Loading data...
      </div>
    ) : (
      <span>Add new Todo</span>
    );

    const searchButtonContent = this.props.isFetchingUsers ? (
      <div>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        Loading data...
      </div>
    ) : (
      <span>Search...</span>
    );

    return (
      <div>
        <Navbar bg="primary" variant="dark">
          <Navbar.Brand>Todo App</Navbar.Brand>
          <Button
            variant="outline-light"
            onClick={this.addTodoClicked}
            disabled={this.props.isFetchingTodos}
          >
            {addButtonContent}
          </Button>
          <Button
            variant="outline-light"
            onClick={this.searchTodoClicked}
            disabled={this.props.isFetchingUsers}
            style={{ marginLeft: "15px" }}
          >
            {searchButtonContent}
          </Button>
        </Navbar>
        <div>
          Found <b>{this.props.todoCount}</b> items, showing{" "}
          <b>{this.props.todos.length}</b>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User</th>
              <th>Id</th>
              <th>Content</th>
              <th>Done</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{todoItems}</tbody>
        </Table>
        <AddTodoModal />
        <SearchTodoModal />
      </div>
    );
  }

  private addTodoClicked = () => this.props.dispatch(showAddTodoModal());

  private onTodoModified = (todo: ITodo) =>
    this.props.dispatch(modifyTodo(todo));

  private onTodoDeleted = (id: string) => this.props.dispatch(deleteTodo(id));

  private searchTodoClicked = () => this.props.dispatch(showSearchTodoModal());
}

const mapStateToProps = (store: ITodoState) => store;

export default connect(mapStateToProps)(TodoApp);
