import React, { Component } from "react";
import "./css/main.css";

class TaskLineItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      taskDone: this.props.isDone,
      checkMarkStyle: this.props.checkMarkStyle,
      textDoneStyle: this.props.textDoneStyle,
      taskInput: this.props.taskValue,
      taskIndex: this.props.index,
      ateCookies: false,
      focused: this.props.focused
    };

    this.selectedInput = React.createRef();

    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.save = this.save.bind(this);
    this.editRender = this.editRender.bind(this);
    this.initialRender = this.initialRender.bind(this);
    this.checkMark = this.checkMark.bind(this);
    this.inputBlur = this.inputBlur.bind(this);
  }

  componentDidUpdate() {
    let currentInput;
    if (this.state.taskInput && this.state.editing) {
      currentInput = this.selectedInput.current;
      currentInput.focus();
    }
  }

  edit() {
    this.setState({
      editing: true
    });
  }

  delete() {
    if (this.state.taskDone) {
      this.props.addCompletedCounter(false);
    }

    this.props.onDelete(this.state.taskIndex);
    this.setState({
      taskDone: false,
      editing: false,
      checkMarkStyle: "checkmark",
      textDoneStyle: "item-text",
      taskInput: ""
    });
  }

  save(e) {
    e.preventDefault();
    const thisInput = this.state.taskInput;
    if (
      this.state.taskInput &&
      (thisInput.includes("cookie") || thisInput.includes("galleta"))
    ) {
      this.setState({ ateCookies: false });
      this.props.eatCookies(true);
    }
    this.props.onUpdate(this.state.taskInput, this.state.taskIndex);
    this.setState({
      editing: false
    });
  }

  checkMark() {
    if (this.state.taskDone) {
      this.setState({
        checkMarkStyle: "checkmark",
        textDoneStyle: "item-text",
        taskDone: false,
        editing: false
      });
      this.props.addCompletedCounter(false);
    } else {
      this.setState({
        checkMarkStyle: "checkmark complete",
        textDoneStyle: "item-text done",
        taskDone: true,
        editing: false
      });
      this.props.addCompletedCounter(true);
    }
    const thisInput = this.state.taskInput.toLowerCase();

    if (
      (thisInput.includes("cookie") || thisInput.includes("galleta")) &&
      !this.state.ateCookies
    ) {
      this.setState({ ateCookies: true });
      this.props.eatCookies(false);
    } else if (
      (thisInput.includes("cookie") || thisInput.includes("galleta")) &&
      this.state.ateCookies
    ) {
      this.setState({ ateCookies: false });
      this.props.eatCookies(true);
    }
  }

  inputBlur() {
    this.save();
  }

  editRender() {
    if (!this.state.editing) this.setState({ editing: true });
    if (this.state.taskInput) {
      return (
        <div className="item-box">
          <div className={this.state.checkMarkStyle} onClick={this.checkMark}>
            <i className="fas fa-check" />
          </div>
          <form className="item-box-edit" onSubmit={this.save}>
            <input
              maxLength="35"
              ref={this.selectedInput}
              onChange={e => this.setState({ taskInput: e.target.value })}
              value={this.state.taskInput}
              onBlur={this.save}
            />
          </form>
          <div className="btn-delete" onClick={this.delete}>
            <i className="far fa-trash-alt" />
          </div>
        </div>
      );
    }
    return (
      <div className="item-box">
        <form className="item-box-blank initial" onSubmit={this.save}>
          <input
            maxLength="35"
            ref={this.selectedInput}
            onChange={e => this.setState({ taskInput: e.target.value })}
            value={this.state.taskInput}
          />
        </form>
      </div>
    );
  }

  initialRender() {
    return (
      <div className="item-box">
        <div className={this.state.checkMarkStyle} onClick={this.checkMark}>
          <i className="fas fa-check" />
        </div>
        <div className={this.state.textDoneStyle} onClick={this.edit}>
          {this.state.taskInput}
        </div>
        <div className="btn-delete" onClick={this.delete}>
          <i className="far fa-trash-alt" />
        </div>
      </div>
    );
  }
  render() {
    return this.state.editing || !this.state.taskInput || this.state.focused
      ? this.editRender()
      : this.initialRender();
  }
}

export default TaskLineItem;
