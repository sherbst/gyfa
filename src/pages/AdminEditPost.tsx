import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { useHistory, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { firestore, firebase } from '../firebase'
import { useFirestoreDoc } from '../lib/db'
import { Post } from '../types'
import { convertFromHTML, convertToHTML } from 'draft-convert'
import { EditorState } from 'draft-js'
import { v4 as uuidv4 } from 'uuid'

interface Params {
  id?: string
}

interface Props {
  isNew?: boolean
}

const AdminEditPost: React.FC<Props> = ({ isNew = false }) => {
  const { id: paramId } = useParams<Params>()
  const [id] = useState(isNew ? uuidv4() : paramId)

  const history = useHistory()

  const [title, setTitle] = useState('')
  const [hidden, setHidden] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  )

  const ref = firestore.collection('posts').doc(id)
  const post = useFirestoreDoc<Post>(ref)

  useEffect(() => {
    if (!post || isNew) return

    setTitle(post.title)
    setHidden(post.hidden)
    setImage(post.image)

    setEditorState(EditorState.createWithContent(convertFromHTML(post.content)))
  }, [post])

  const handleSave = async () => {
    const content = convertToHTML(editorState.getCurrentContent())

    if (isNew) {
      const newPost: Post = {
        title,
        hidden,
        image,
        content,
        date: firebase.firestore.Timestamp.now(),
      }
      ref.set(newPost)
    } else {
      const updatedPost: Partial<Post> = { title, hidden, image, content }
      await ref.update(updatedPost)
    }

    history.push(`/posts/${post?.id}`)
  }

  return (
    <>
      <Header />

      <section className="section">
        <div className="container">
          {post ? (
            <>
              <h1 className="title">{post.title}</h1>

              <div className="field">
                <label className="label">Title</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Hidden</label>
                <div className="control">
                  <div className="control">
                    <label className="radio">
                      <input
                        type="radio"
                        name="foobar"
                        checked={hidden}
                        onChange={(e) => setHidden(e.target.checked)}
                      />
                      Yes
                    </label>
                    <label className="radio">
                      <input
                        type="radio"
                        name="foobar"
                        checked={!hidden}
                        onChange={(e) => setHidden(!e.target.checked)}
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div className="field">
                <label className="label">Image URL</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={image || ''}
                    onChange={(e) => setImage(e.target.value || null)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Content</label>
                <div className="control">
                  <Editor
                    editorStyle={{ border: '1px solid #C0C0C0' }}
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                  />
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <button onClick={handleSave} className="button is-info">
                    Save
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </section>
    </>
  )
}

export default AdminEditPost
