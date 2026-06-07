import { NextResponse } from 'next/server';
import { getTasks, createTask } from '@/lib/taskStorage';

export async function GET() {
  try {
    const tasks = await getTasks();
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json({ error: 'Unable to load tasks' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const dueDate = body.dueDate ?? null;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required and cannot be empty' },
        { status: 400 }
      );
    }

    const task = await createTask({ title, description, dueDate });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json({ error: 'Unable to create task' }, { status: 500 });
  }
}
