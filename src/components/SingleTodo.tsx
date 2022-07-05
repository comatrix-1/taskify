import React, { useState, useRef, useEffect, useReducer } from "react";
import { Todo } from "../model";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import "./styles.css";
import TodoList from "./TodoList";
import { Action } from "../model";
import { Draggable } from "react-beautiful-dnd";

type Props = {
  index: number;
  todo: Todo;
  todos: Todo[];
  dispatch: React.Dispatch<Action>;
};

const SingleTodo = ({ index, todo, todos, dispatch }: Props) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<string>(todo.todo);

  const handleDone = (id: number) => {
    dispatch({ type: "done", payload: id });
  };

  const handleDelete = (id: number) => {
    dispatch({ type: "remove", payload: id });
  };

  const handleEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault();

    dispatch({ type: "edit", payload: { id, todo: editTodo } });

    setEdit(false);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  console.log("SingleToDo loaded", todo, index);

  return (
    <Draggable
      key={todo.id.toString()}
      draggableId={todo.id.toString()}
      index={index}
    >
      {(provided, snapshot) => (
        <form
          className={`todos__single ${snapshot.isDragging ? "drag" : ""}`}
          onSubmit={(e) => handleEdit(e, todo.id)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {edit ? (
            <input
              ref={inputRef}
              value={editTodo}
              onChange={(e) => setEditTodo(e.target.value)}
              className="todos__single--text"
            />
          ) : todo.isDone ? (
            <s className="todos__single--text">{todo.todo}</s>
          ) : (
            <span className="todos__single--text">{todo.todo}</span>
          )}
          <div>
            <span
              className="icon"
              onClick={() => {
                if (!edit && !todo.isDone) {
                  setEdit(!edit);
                }
              }}
            >
              <AiFillEdit />
            </span>
            <span className="icon" onClick={() => handleDelete(todo.id)}>
              <AiFillDelete />
            </span>
            <span className="icon" onClick={() => handleDone(todo.id)}>
              <MdDone />
            </span>
          </div>
        </form>
      )}
    </Draggable>
  );
};

export default SingleTodo;
