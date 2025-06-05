import { NextRequest, NextResponse } from 'next/server'
import { azureTranslatorService } from '@/lib/azure-translator'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()
    
    if (!text) {
      return NextResponse.json(
        { message: 'Text is required' },
        { status: 400 }
      )
    }

    const translatedText = await azureTranslatorService.translateTheological(text)
    
    return NextResponse.json({
      translatedText,
      model: 'theological-ko-en-v1',
      sourceLanguage: 'ko',
      targetLanguage: 'en'
    })
  } catch (error) {
    console.error('Theological translation error:', error)
    return NextResponse.json(
      { message: 'Theological translation failed' },
      { status: 500 }
    )
  }
}