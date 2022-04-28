import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { ITodo } from "../model/todo";

interface ITodoRowProps {
  todo: ITodo;
  onTodoModified: (todo: ITodo) => any;
  onTodoDeleted: (id: string) => any;
}

export class TodoRow extends Component<ITodoRowProps> {
  public render() {
    const doneCell = !this.props.todo.isChanging ? (
      <Form>
        <Form.Check
          custom
          type="checkbox"
          id={`checkbox-${this.props.todo.id}`}
          checked={this.props.todo.completed}
          label=""
          onChange={(e: React.FormEvent<EventTarget>) =>
            this.handleCheckedChanged((event && event.target) || null)
          }
        />
      </Form>
    ) : (
      <Spinner animation="border" role="status" variant="primary" size="sm">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );

    const deleteCell = !this.props.todo.isChanging ? (
      <Button
        variant="primary"
        size="sm"
        onClick={() => this.props.onTodoDeleted(this.props.todo.id)}
      >
        Delete
      </Button>
    ) : (
      <Spinner animation="border" role="status" variant="primary" size="sm">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );

    return (
      <tr>
        <td>{this.props.todo.userId}</td>
        <td>{this.props.todo.id}</td>
        <td>{this.props.todo.title}</td>
        <td>{doneCell}</td>
        <td>{deleteCell}</td>
      </tr>
    );
  }

  private handleCheckedChanged(target: EventTarget | null) {
    if (!target) {
      return;
    }

    const inputElement = target as HTMLInputElement;
    this.props.onTodoModified({
      ...this.props.todo,
      completed: inputElement.checked
    });
  }
}
