import React, { useState, useEffect } from "react"
import FeedPost from "app/FeedPost"
import { loadFeedPosts, subscribeToNewFeedPosts } from "app/utils"
// import FeedFinal from './Feed.final'
// export default FeedFinal
export default Feed

function Feed() {
  const [posts, setPosts] = useState([])
  const [newestPosts, setNewestPosts] = useState([])
  const [time, setTime] = useState(Date.now())
  const [postLimit, setPostLimit] = useState(3)

  useEffect(() => {
    return subscribeToNewFeedPosts(time, newestPosts =>
      setNewestPosts(newestPosts)
    )
  }, [time])

  useEffect(() => {
    let canceled = false
    loadFeedPosts(time, postLimit).then(posts => !canceled && setPosts(posts))
    return () => (canceled = true)
  }, [time, postLimit])

  return (
    <div className="Feed">
      {newestPosts.length ? (
        <div className="Feed_button_wrapper">
          <button
            className="Feed_new_posts_button icon_button"
            onClick={() => {
              setTime(Date.now())
              setPostLimit(postLimit + newestPosts.length)
              setNewestPosts([])
            }}
          >
            View {newestPosts.length} New Post(s)
          </button>
        </div>
      ) : null}

      {posts ? (
        posts.map(post => <FeedPost key={post.id} post={post} />)
      ) : (
        <div>Loading Posts ...</div>
      )}

      <div className="Feed_button_wrapper">
        <button
          className="Feed_new_posts_button icon_button"
          onClick={() => setPostLimit(postLimit + 3)}
        >
          View More
        </button>
      </div>
    </div>
  )
}
