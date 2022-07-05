import React, { useState, useReducer } from "react";
import "./App.css";
import InputField from "./components/InputField";
import { Todo } from "./model";
import TodoList from "./components/TodoList";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Action } from "./model";

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  const TodoReducer = (state: Todo[], action: Action) => {
    switch (action.type) {
      case "add":
        return [
          ...state,
          { id: Date.now(), todo: action.payload, isDone: false },
        ];
      case "edit":
        return state.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, todo: action.payload.todo }
            : todo
        );
      case "remove":
        return state.filter((todo) => todo.id !== action.payload);
      case "done":
        return state.map((todo) =>
          todo.id === action.payload ? { ...todo, isDone: !todo.isDone } : todo
        );
      case "reorder":
        return action.payload;
      default:
        return state;
    }
  };

  const [todos, dispatch] = useReducer(TodoReducer, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch({ type: "add", payload: todo });

    setTodo("");
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    let add,
      active = todos,
      complete = completedTodos;

    if (source.droppableId === "TodosList") {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
    }

    if (destination.droppableId === "TodosList") {
      active.splice(destination.index, 0, add);
    } else {
      complete.splice(destination.index, 0, add);
    }

    setCompletedTodos(complete);
    dispatch({ type: "reorder", payload: active });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <div className="container">
          <span className="heading">Taskify</span>
          <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
          {/* TodoList  */}
          <TodoList
            todos={todos}
            // setTodos={setTodos}
            dispatch={dispatch}
            completedTodos={completedTodos}
            setCompletedTodos={setCompletedTodos}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default App;
