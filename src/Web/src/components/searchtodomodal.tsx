import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FormControlProps } from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import {
  closeSearchTodoModal,
  ITodoAction,
  updatePendingSearch,
  fetchTodos
} from "../redux/actions";
import { ITodoState } from "../redux/reducer";
import { IUser } from "../model/user";

interface ISearchTodoModalProps {
  show: boolean;
  users: IUser[];
  searchUserId: number | undefined;
  searchText: string;
  dispatch: ThunkDispatch<ITodoState, undefined, ITodoAction>;
}

class SearchTodoModal extends Component<ISearchTodoModalProps> {
  public render() {
    const users = this.props.users;

    var userItems =
      users && users.map(u => <option key={u.id}>{u.name}</option>);
    if (userItems) {
      userItems.push(<option key={-1}>any</option>);
    }

    return (
      <Modal show={this.props.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="searchFormUserId">
              <Form.Label>User</Form.Label>
              <Form.Control
                as="select"
                value={
                  (this.props.searchUserId &&
                    this.props.users[this.props.searchUserId - 1].name) ||
                  "any"
                }
                onChange={(e: React.FormEvent<EventTarget>) =>
                  this.handleUserIdChange((event && event.target) || null)
                }
              >
                {userItems}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="searchFormTodoText">
              <Form.Label>Text</Form.Label>
              <Form.Control
                type="input"
                placeholder="Text description to search for."
                value={this.props.searchText}
                onChange={(e: React.FormEvent<FormControlProps>) =>
                  this.handleTextChange((event && event.target) || null)
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleSearch}>
            Search
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  private handleClose = () => this.props.dispatch(closeSearchTodoModal());

  private handleSearch = () =>
    this.props.dispatch(
      fetchTodos(this.props.searchUserId, this.props.searchText)
    );

  private handleUserIdChange(target: EventTarget | null) {
    if (!target) {
      return;
    }

    const inputElement = target as HTMLSelectElement;

    const actualSelectedUser =
      inputElement.value == "any"
        ? undefined
        : Number(this.props.users[inputElement.selectedIndex].id);

    this.props.dispatch(
      updatePendingSearch(actualSelectedUser, this.props.searchText)
    );
  }

  private handleTextChange(target: EventTarget | null) {
    if (!target) {
      return;
    }

    const inputElement = target as HTMLInputElement;
    this.props.dispatch(
      updatePendingSearch(this.props.searchUserId, inputElement.value)
    );
  }
}

const mapStateToProps = (store: ITodoState) => ({
  show: store.showSearchTodoModal,
  users: store.users,
  searchUserId: store.searchUserId,
  searchText: store.searchText
});

export default connect(mapStateToProps)(SearchTodoModal);
