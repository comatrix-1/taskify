export interface Todo {
  id: number;
  todo: string;
  isDone: boolean;
}

export type Action =
  | { type: "add"; payload: string }
  | { type: "edit"; payload: { id: number; todo: string } }
  | { type: "remove"; payload: number }
  | { type: "done"; payload: number }
  | { type: "reorder"; payload: Todo[] };
