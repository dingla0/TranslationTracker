import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { translationProjects, contents, users } from '@/shared/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  try {
    const projects = await db
      .select()
      .from(translationProjects)
      .leftJoin(contents, eq(translationProjects.contentId, contents.id))
      .leftJoin(users, eq(translationProjects.assignedTo, users.id))
      .orderBy(desc(translationProjects.createdAt))

    const formattedProjects = projects.map(({ translation_projects, contents, users }) => ({
      ...translation_projects,
      content: contents,
      assignedTo: users,
    }))

    return NextResponse.json(formattedProjects)
  } catch (error) {
    console.error('Error fetching translation projects:', error)
    return NextResponse.json(
      { message: 'Failed to fetch translation projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const [project] = await db
      .insert(translationProjects)
      .values(body)
      .returning()

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating translation project:', error)
    return NextResponse.json(
      { message: 'Failed to create translation project' },
      { status: 400 }
    )
  }
}