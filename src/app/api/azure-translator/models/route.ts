import { NextResponse } from 'next/server'
import { azureTranslatorService } from '@/lib/azure-translator'

export async function GET() {
  try {
    const models = await azureTranslatorService.getCustomModels()
    return NextResponse.json(models)
  } catch (error) {
    console.error('Error fetching Azure translator models:', error)
    return NextResponse.json(
      { message: 'Failed to fetch translator models' },
      { status: 500 }
    )
  }
}