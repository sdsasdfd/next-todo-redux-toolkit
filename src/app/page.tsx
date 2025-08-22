"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RootState } from "@/lib/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  addTodo,
  createTodo,
  deleteTodo,
  editTodo,
  fetchTodos,
  MarkCompleteTodo,
  selectError,
  selectLoading,
  selectTodos,
  Todo,
} from "@/lib/store/features/todoSlice";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TableOfContents } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

const Page = () => {
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditTitle] = useState<string>("");
  // const { todos } = useSelector((state: RootState) => state.todo);
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  console.log("Todos", todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditing) {
      if (editingTodoId !== null) {
        dispatch(editTodo({ id: editingTodoId, title: values.title }));
        setIsEditing(false);
        setEditingTodoId(null);
      }
      setEditTitle("");
    } else {
      // const newTodo = {
      //   id: Date.now(),
      //   title: values.title,
      //   completed: false,
      // };
      dispatch(createTodo(values.title));
    }
    form.reset();
  };

  useEffect(() => {
    form.reset({ title: editedTitle });
  }, [editedTitle]);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-2">
      <Card className=" mt-5">
        <CardHeader className=" flex items-center justify-center">
          <CardTitle className="text-2xl text-cyan-400">
            Redux ToolKit Todo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className=" flex items-center gap-2 justify-center"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Input
                      placeholder="Enter Title"
                      {...field}
                      className=" w-[300px]"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEditing ? (
                <Button
                  type="submit"
                  variant={"ghost"}
                  className=" border cursor-pointer hover:bg-transparent border-cyan-400 text-cyan-600 hover:text-cyan-600"
                >
                  Submit
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant={"ghost"}
                    onClick={() => {
                      setIsEditing(false);
                      setEditTitle("");
                    }}
                    className=" border cursor-pointer hover:bg-transparent border-cyan-400 text-cyan-600 hover:text-cyan-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant={"ghost"}
                    className=" border cursor-pointer hover:bg-transparent border-cyan-400 text-cyan-600 hover:text-cyan-600"
                  >
                    Update
                  </Button>
                </>
              )}
            </form>
          </Form>
          <div className=" mt-5 flex gap-4 flex-wrap">
            {loading ? (
              <div>Loading...</div>
            ) : (
              todos?.map((todo: Todo) => (
                <div
                  className={` border w-[250px] flex items-center justify-between p-2 rounded-md ${
                    todo.completed
                      ? "bg-green-200 hover:bg-green-200"
                      : "bg-gray-50 hover:bg-gray-200"
                  } `}
                  key={todo.id}
                >
                  <div className=" flex justify-between items-center w-full">
                    <p>{todo.title}</p>

                    <DropdownMenu>
                      <DropdownMenuTrigger className=" cursor-pointer">
                        <TableOfContents />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {todo.completed === false && (
                          <DropdownMenuItem
                            onClick={() => {
                              setIsEditing(true);
                              setEditingTodoId(todo.id);
                              setEditTitle(todo.title);
                            }}
                            disabled={isEditing}
                          >
                            Edit
                          </DropdownMenuItem>
                        )}
                        {todo.completed ? (
                          <DropdownMenuItem
                            onClick={() => dispatch(MarkCompleteTodo(todo.id))}
                          >
                            Mark as Incomplete
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => dispatch(MarkCompleteTodo(todo.id))}
                            disabled={isEditing}
                          >
                            Mark as Complete
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            dispatch(deleteTodo(todo.id));
                            form.reset({ title: "" });
                            setIsEditing(false);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {/* {editingTodoId !== todo.id ? (
                    <div className=" flex justify-between items-center w-full">
                      <p>{todo.title}</p>

                      <DropdownMenu>
                        <DropdownMenuTrigger className=" cursor-pointer">
                          <TableOfContents />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {todo.completed === false && (
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingTodoId(todo.id);
                                setEditTitle(todo.title);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                          )}
                          {todo.completed ? (
                            <DropdownMenuItem
                              onClick={() =>
                                dispatch(MarkCompleteTodo(todo.id))
                              }
                            >
                              Mark as Incomplete
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                dispatch(MarkCompleteTodo(todo.id))
                              }
                            >
                              Mark as Complete
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => dispatch(deleteTodo(todo.id))}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <>
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <Button
                        onClick={() => {
                          setEditingTodoId(null);
                          dispatch(
                            editTodo({ id: todo.id, title: editedTitle })
                          );
                        }}
                      >
                        Save
                      </Button>
                    </>
                  )} */}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
