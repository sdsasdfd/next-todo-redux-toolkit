import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

export const fetchTodos = createAsyncThunk("todos/fetch", async () => {
  try {
    const res = await axios.get("/api/todo");

    return res.data.todos;
  } catch (error) {
    throw error;
  }
});

export const createTodo = createAsyncThunk(
  "todo/create",
  async (title: string) => {
    try {
      const res = await axios.post("/api/todo", { title });
      return res.data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todo/delete",
  async (id: string) => {
    try {
      const res = await axios.delete("/api/todo", { data: { id } });
      return res.data;
    } catch (error) {
      throw error;
    }
  }
);

export const MarkCompleteTodo = createAsyncThunk(
  "todo/complete",
  async (id: string) => {
    try {
      const res = await axios.patch("/api/todo", { id });
      return res.data;
    } catch (error) {
      throw error;
    }
  }
);

export const editTodo = createAsyncThunk(
  "todo/edit",
  async ({ id, title }: { id: string; title: string }) => {
    try {
      const res = await axios.put("/api/todo", { id, title });
      return res.data;
    } catch (error) {
      throw error;
    }
  }
);

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      console.log(action.payload);
      const newTodos = [action.payload, ...state.todos];
      state.todos = newTodos;
    },
    // deleteTodo: (state, action) => {
    //   const id = action.payload;
    //   const newTodos = state.todos.filter((todo) => todo.id !== id);
    //   state.todos = newTodos;
    // },
    // MarkCompleteTodo: (state, action) => {
    //   const id = action.payload;

    //   const newTodos = state.todos.map((todo) => {
    //     if (todo.id === id) {
    //       return { ...todo, completed: !todo.completed };
    //     }
    //     return todo;
    //   });
    //   state.todos = newTodos;
    // },
    // editTodo: (state, action) => {
    //   const { id, title } = action.payload;
    //   console.log("Editing Todo", id, title);
    //   const newTodos = state.todos.map((todo) => {
    //     if (todo.id === id) {
    //       return { ...todo, title };
    //     }
    //     return todo;
    //   });
    //   state.todos = newTodos;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch todos";
      })
      .addCase(createTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        console.log("Todo created", action.payload);
        state.loading = false;
        state.todos.unshift(action.payload.todo);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create todo";
      })
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        console.log("deleted extra reducer", action.payload);
        state.loading = false;
        state.todos = state.todos.filter(
          (todo) => todo.id !== action.payload.id
        );
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create todo";
      })
      .addCase(MarkCompleteTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(MarkCompleteTodo.fulfilled, (state, action) => {
        console.log("mark complete extra reducer", action.payload);
        state.loading = false;
        const newTodos = state.todos.map((todo) => {
          if (todo.id === action.payload.todo.id) {
            return { ...todo, completed: !todo.completed };
          }
          return todo;
        });
        state.todos = newTodos;
      })
      .addCase(MarkCompleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create todo";
      })
      .addCase(editTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(editTodo.fulfilled, (state, action) => {
        console.log("edit complete extra reducer", action.payload);
        state.loading = false;

        const newTodos = state.todos.map((todo) => {
          if (todo.id === action.payload.todo.id) {
            return { ...todo, title: action.payload.todo.title };
          }
          return todo;
        });
        state.todos = newTodos;
      })
      .addCase(editTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create todo";
      });
  },
});

export const { addTodo } = todoSlice.actions;

export const selectLoading = (state: RootState) => state.todo.loading;
export const selectTodos = (state: RootState) => state.todo.todos;
export const selectError = (state: RootState) => state.todo.error;

export default todoSlice.reducer;
