import { NextRequest, NextResponse } from 'next/server'
import { RunwareClient, RunwareGenerationOptions } from '@/lib/runware-client'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

export interface GenerateAdventureImageRequest {
  themeId?: string
  customContent?: string
  customName?: string
  customDescription?: string
  seed?: number
}

export interface GenerateAdventureImageResponse {
  success: boolean
  imageUrl?: string
  localPath?: string
  filename?: string
  error?: string
  themeConfig?: {
    id: string
    name: string
    description: string
    palette: string[]
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: GenerateAdventureImageRequest = await request.json()
    console.log('🎨 Adventure image generation request:', body)

    const {
      themeId,
      customContent,
      customName = 'Custom Adventure',
      customDescription = 'A unique custom adventure experience',
      seed
    } = body

    // Initialize Runware client
    const runware = new RunwareClient()

    // Generate generation options
    const options: RunwareGenerationOptions = {
      themeId,
      customContent,
      seed: seed || Math.floor(Math.random() * 1000000),
      width: 768,
      height: 768,
      steps: 30,
      guidance: 7
    }

    // Generate image
    console.log('🚀 Starting image generation...')
    const result = await runware.generateAdventureImage(options)

    if (!result.success) {
      console.error('❌ Image generation failed:', result.error)
      return NextResponse.json({
        success: false,
        error: result.error || 'Image generation failed'
      } as GenerateAdventureImageResponse, { status: 500 })
    }

    if (!result.imageUrl) {
      return NextResponse.json({
        success: false,
        error: 'No image URL received from Runware'
      } as GenerateAdventureImageResponse, { status: 500 })
    }

    // Download and save image locally
    let localPath: string | undefined
    let filename: string | undefined

    try {
      console.log('💾 Downloading image from:', result.imageUrl)
      const imageResponse = await fetch(result.imageUrl)
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.status}`)
      }

      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())
      
      // Create generated images directory
      const generatedDir = join(process.cwd(), 'public', 'images', 'generated')
      if (!existsSync(generatedDir)) {
        mkdirSync(generatedDir, { recursive: true })
      }

      // Generate filename
      const finalThemeId = themeId || 'custom'
      const finalSeed = options.seed || 123456789
      filename = runware.generateFilename(finalThemeId, finalSeed)
      localPath = join(generatedDir, filename)

      // Save file
      writeFileSync(localPath, imageBuffer)
      console.log('✅ Image saved locally:', localPath)

      // Convert to public URL
      const publicUrl = `/images/generated/${filename}`

      // Get theme configuration
      const themeConfig = themeId ? runware.getThemeConfig(themeId) : null
      const finalThemeConfig = themeConfig ? {
        id: themeConfig.id,
        name: customName || themeConfig.name,
        description: customDescription || `${themeConfig.name} themed adventure`,
        palette: themeConfig.palette
      } : {
        id: 'custom',
        name: customName,
        description: customDescription,
        palette: ['#1A1A1A', '#2D2D2D', '#4A4A4A', '#6A6A6A'] // Default gray palette
      }

      const response: GenerateAdventureImageResponse = {
        success: true,
        imageUrl: publicUrl, // Return local public URL
        localPath: publicUrl,
        filename,
        themeConfig: finalThemeConfig
      }

      console.log('🎉 Image generation completed successfully:', response)
      return NextResponse.json(response, { status: 200 })

    } catch (downloadError) {
      console.error('❌ Error downloading/saving image:', downloadError)
      
      // Return the original URL if local save fails
      const response: GenerateAdventureImageResponse = {
        success: true,
        imageUrl: result.imageUrl,
        error: `Local save failed: ${downloadError instanceof Error ? downloadError.message : 'Unknown error'}`,
        themeConfig: themeId ? {
          id: themeId,
          name: customName,
          description: customDescription,
          palette: runware.getThemeConfig(themeId)?.palette || []
        } : undefined
      }

      return NextResponse.json(response, { status: 200 })
    }

  } catch (error) {
    console.error('❌ Adventure image generation error:', error)
    
    const response: GenerateAdventureImageResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown server error'
    }

    return NextResponse.json(response, { status: 500 })
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const runware = new RunwareClient()
    const themes = runware.getAllThemes()

    return NextResponse.json({
      success: true,
      themes: themes.map(theme => ({
        id: theme.id,
        name: theme.name,
        palette: theme.palette,
        seed: theme.seed
      }))
    }, { status: 200 })

  } catch (error) {
    console.error('❌ Error fetching themes:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown server error'
    }, { status: 500 })
  }
}