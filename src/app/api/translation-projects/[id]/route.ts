import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { translationProjects, contents, users } from '@/shared/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    const [result] = await db
      .select()
      .from(translationProjects)
      .leftJoin(contents, eq(translationProjects.contentId, contents.id))
      .leftJoin(users, eq(translationProjects.assignedTo, users.id))
      .where(eq(translationProjects.id, id))

    if (!result) {
      return NextResponse.json(
        { message: 'Translation project not found' },
        { status: 404 }
      )
    }

    const formattedProject = {
      ...result.translation_projects,
      content: result.contents,
      assignedTo: result.users,
    }

    return NextResponse.json(formattedProject)
  } catch (error) {
    console.error('Error fetching translation project:', error)
    return NextResponse.json(
      { message: 'Failed to fetch translation project' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    
    const [updatedProject] = await db
      .update(translationProjects)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(translationProjects.id, id))
      .returning()

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error updating translation project:', error)
    return NextResponse.json(
      { message: 'Failed to update translation project' },
      { status: 400 }
    )
  }
}