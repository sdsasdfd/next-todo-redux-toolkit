import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });
    console.log("Todos fetched:", data);
    console.log("Error fetching todos:", error);

    if (error) {
      return NextResponse.json(
        { message: error.message, success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { todos: data, message: "Todos fetched successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching todos:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message, success: false },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error fetching todos", success: false },
        { status: 500 }
      );
    }
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const supabase = await createClient();

    const { title } = await req.json();

    console.log("title", title);

    const { data, error } = await supabase
      .from("todos")
      .insert({ title: title })
      .select("*")
      .single();

    console.log("Todo created:", data);
    console.log("Error creating todo:", error);

    if (error) {
      return NextResponse.json(
        {
          message: error.message,
          success: false,
        },
        { status: 500 }
      );
    }
    console.log("Data:", data);

    return NextResponse.json(
      { message: "Todo created successfully", success: true, todo: data },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error while creating todo");
    return NextResponse.json({
      message: "Error while creating todo",
      success: false,
    });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const supabase = await createClient();
    const { id } = await req.json();

    const { data, error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .select("id")
      .single();

    console.log("Todo deleted:", data);
    console.log("Error deleting todo:", error);

    if (error) {
      return NextResponse.json(
        {
          message: error.message,
          success: false,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Todo deleted successfully",
        success: true,
        id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while deleting todo");
    return NextResponse.json({
      message: "Error while deleting todo",
      success: false,
    });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const supabase = await createClient();
    const { id } = await req.json();

    const { data, error } = await supabase
      .from("todos")
      .update({ completed: true })
      .eq("id", id)
      .select("*")
      .single();

    console.log("Todo updated:", data);
    console.log("Error updating todo:", error);

    if (error) {
      return NextResponse.json(
        {
          message: error.message,
          success: false,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        message: "Todo updated successfully",
        success: true,
        todo: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while updating todo");
    return NextResponse.json({
      message: "Error while updating todo",
      success: false,
    });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const supabase = await createClient();
    const { id, title } = await req.json();

    const { data, error } = await supabase
      .from("todos")
      .update({ title: title })
      .eq("id", id)
      .select("*")
      .single();

    console.log("Todo updated:", data);
    console.log("Error updating todo:", error);

    if (error) {
      return NextResponse.json(
        {
          message: error.message,
          success: false,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        message: "Todo updated successfully",
        success: true,
        todo: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while updating todo");
    return NextResponse.json({
      message: "Error while updating todo",
      success: false,
    });
  }
};
