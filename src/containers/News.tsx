import React from 'react'
import { useFirestoreCollection } from '../lib/db'
import { Post, WithId } from '../types'
import TextTruncate from 'react-text-truncate'
import { Link } from 'react-router-dom'

const News: React.FC = () => {
  const posts = (useFirestoreCollection<WithId<Post>>('posts') || [])
    .filter((post) => !post.hidden)
    .sort((a, b) => a.date.toMillis() - b.date.toMillis())

  return (
    <div className="columns">
      {posts.map((post) => (
        <div className="column is-one-third">
          <div className="card">
            <header className="card-header">
              <p className="card-header-title">{post.title}</p>
            </header>

            {post.image && (
              <div className="card-image">
                <figure className="image is-4by3">
                  <img src={post.image} />
                </figure>
              </div>
            )}

            <div className="card-content">
              <div className="content">
                <TextTruncate
                  line={3}
                  element="span"
                  truncateText="…"
                  text={post.content}
                  textTruncateChild={
                    <Link to={`/posts/${post.id}`}>Read on</Link>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default News
