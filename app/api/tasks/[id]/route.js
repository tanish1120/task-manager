import { NextResponse } from 'next/server';
import { getTaskById, updateTask, deleteTask } from '@/lib/taskStorage';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const existingTask = await getTaskById(id);

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const body = await request.json();
    const updates = {};

    if (typeof body.title === 'string') {
      updates.title = body.title.trim();
    }
    if (typeof body.description === 'string') {
      updates.description = body.description.trim();
    }
    if (body.dueDate !== undefined) {
      updates.dueDate = body.dueDate;
    }

    const updatedTask = await updateTask(id, updates);

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error('PUT /api/tasks/[id] error:', error);
    return NextResponse.json({ error: 'Unable to update task' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const deleted = await deleteTask(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/tasks/[id] error:', error);
    return NextResponse.json({ error: 'Unable to delete task' }, { status: 500 });
  }
}
