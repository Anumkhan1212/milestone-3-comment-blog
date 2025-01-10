'use client'

import { useState, useEffect } from 'react'
import CommentForm from './CommentForm'
import { formatDistanceToNow } from 'date-fns'

interface Comment {
  _id: string
  name: string
  comment: string
  createdAt: string
  parentComment?: string
}

interface CommentsProps {
  postId: string
  initialComments: Comment[]
}

export default function Comments({ postId, initialComments }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`)
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  useEffect(() => {
    // Only fetch if we don't have initial comments
    if (!initialComments.length) {
      fetchComments()
    }
  }, [initialComments])

  const handleCommentSubmitted = () => {
    fetchComments()
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <CommentForm postId={postId} onSuccess={handleCommentSubmitted} />
      <div className="mt-8 space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="border p-4 rounded">
            <div className="font-semibold">{comment.name}</div>
            <div className="text-gray-600 text-sm">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </div>
            <div className="mt-2">{comment.comment}</div>
          </div>
        ))}
      </div>
    </div>
  )
} 