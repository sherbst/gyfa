import React from 'react'
import { useFirestoreDoc } from '../lib/db'
import { firestore } from '../firebase'
import { useParams } from 'react-router-dom'
import { Post as IPost } from '../types'
import Header from '../components/Header'
import FormattedDate from '../components/FormattedDate'

interface Params {
  id?: string
}

interface Props {
  id?: string
}

const Post: React.FC<Props> = ({ id: idProp }) => {
  const { id: idParam } = useParams<Params>()
  const id = idParam || idProp || ''
  const post = useFirestoreDoc<IPost>(firestore.collection('posts').doc(id))

  return (
    <>
      <Header />
      <section className="section">
        <div className="container">
          {post ? (
            <>
              <h1 className="title">{post.title}</h1>
              {!post.hidden && (
                <p className="subtitle">
                  <FormattedDate date={post.date} />
                </p>
              )}
              {post.image && <img src={post.image} />}
              <p className="content">{post.content}</p>
            </>
          ) : (
            <p>Loading ...</p>
          )}
        </div>
      </section>
    </>
  )
}

export default Post
