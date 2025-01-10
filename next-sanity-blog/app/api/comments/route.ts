import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function POST(request: Request) {
  try {
    const { name, email, comment, postId, parentCommentId, createdAt } = await request.json()

    if (!process.env.SANITY_API_TOKEN) {
      throw new Error('Sanity API token is missing')
    }

    const doc = {
      _type: 'comment',
      name,
      email,
      comment,
      post: {
        _type: 'reference',
        _ref: postId
      },
      createdAt: new Date(createdAt).toISOString(),
      ...(parentCommentId && {
        parentComment: {
          _type: 'reference',
          _ref: parentCommentId
        }
      })
    }

    const result = await client.create(doc)
    
    return NextResponse.json({ message: 'Comment created', comment: result }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Error creating comment' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    const query = `*[_type == "comment" && post._ref == $postId] | order(createdAt desc) {
      _id,
      name,
      email,
      comment,
      createdAt,
      post->{
        _id,
        title
      },
      "parentComment": parentComment._ref
    }`

    const comments = await client.fetch(query, { postId })
    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Error fetching comments' }, { status: 500 })
  }
} 