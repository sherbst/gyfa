import React from 'react'
import TextTruncate from 'react-text-truncate'
import AdminNav from '../components/AdminNav'
import FormattedDate from '../components/FormattedDate'
import Header from '../components/Header'
import { useFirestoreCollection } from '../lib/db'
import { Post } from '../types'
import h2p from 'html2plaintext'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

const Admin: React.FC = () => {
  const posts = useFirestoreCollection<Post>('posts') || []

  return (
    <>
      <Header />

      <section className="section">
        <AdminNav />

        <Link to="/admin/posts/new" className="button is-link">
          <span className="icon">
            <FontAwesomeIcon icon={faPlusCircle} />
          </span>
          <span>New Post</span>
        </Link>

        <table className="table is-fullwidth">
          <tbody>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Hidden</th>
              <th>Content</th>
            </tr>

            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <Link to={`/admin/posts/${post.id}`}>{post.title}</Link>
                </td>
                <td>
                  <FormattedDate date={post.date} />
                </td>
                <td>{post.hidden ? 'Yes' : 'No'}</td>
                <td>
                  <TextTruncate
                    line={1}
                    element="span"
                    truncateText="…"
                    text={h2p(post.content)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

export default Admin
