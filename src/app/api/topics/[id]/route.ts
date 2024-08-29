import Topic from "src/app/models/topic"
import { NextResponse } from "next/server";
import { AnyArray } from "mongoose";

export async function GET(request: any, { params }: any) {
  const { id } = params;

  const foundTicket = await Topic.findOne({ _id: id });
  return NextResponse.json({ foundTicket }, { status: 200 });
}

export async function PUT(req: any, { params }: any) {
  try {
    const { id } = params;

    const topicData = await req.json();

    const updateTicketData = await Topic.findByIdAndUpdate(id, {
      ...topicData,
    });

    return NextResponse.json({ message: "Topic updated" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function DELETE(req: any, { params }: any) {
  try {
    const { id } = params;

    await Topic.findByIdAndDelete(id);
    return NextResponse.json({ message: "Topic Deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
