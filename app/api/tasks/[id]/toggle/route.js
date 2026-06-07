import { NextResponse } from 'next/server';
import { getTaskById, toggleTask } from '@/lib/taskStorage';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const existingTask = await getTaskById(id);

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updatedTask = await toggleTask(id);

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error('PATCH /api/tasks/[id]/toggle error:', error);
    return NextResponse.json({ error: 'Unable to toggle task' }, { status: 500 });
  }
}
