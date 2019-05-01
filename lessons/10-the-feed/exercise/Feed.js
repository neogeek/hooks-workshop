import React, { useState, useEffect, useReducer } from "react"
import FeedPost from "app/FeedPost"
import { loadFeedPosts, subscribeToNewFeedPosts } from "app/utils"
// import FeedFinal from './Feed.final'
// export default FeedFinal
export default Feed

let feedCache

function Feed() {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "LOAD_POSTS":
          return {
            ...state,
            posts: action.posts
          }
        case "LOAD_NEW_POSTS":
          return {
            ...state,
            newPosts: action.newPosts
          }
        case "VIEW_NEW":
          return {
            ...state,
            time: Date.now(),
            limit: state.limit + state.newPosts.length
          }
        case "VIEW_MORE":
          return {
            ...state,
            limit: state.limit + 3
          }
        default:
          return state
      }
    },
    feedCache || {
      posts: [],
      newPosts: [],
      time: Date.now(),
      limit: 3
    }
  )

  const { time, limit, newPosts, posts } = state

  useEffect(() => {
    return subscribeToNewFeedPosts(time, newPosts =>
      dispatch({ type: "LOAD_NEW_POSTS", newPosts })
    )
  }, [time])

  useEffect(() => {
    feedCache = state
  })

  useEffect(() => {
    let canceled = false
    loadFeedPosts(time, limit).then(
      posts => !canceled && dispatch({ type: "LOAD_POSTS", posts })
    )
    return () => (canceled = true)
  }, [time, limit])

  return (
    <div className="Feed">
      {newPosts.length ? (
        <div className="Feed_button_wrapper">
          <button
            className="Feed_new_posts_button icon_button"
            onClick={() => {
              dispatch({ type: "VIEW_NEW" })
            }}
          >
            View {newPosts.length} New Post(s)
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
          onClick={() => dispatch({ type: "VIEW_MORE" })}
        >
          View More
        </button>
      </div>
    </div>
  )
}
