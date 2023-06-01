import { useState } from "react";

import { PostDetail } from "./PostDetail";
import { useQuery } from "react-query";

const maxPostPage = 10;

async function fetchPosts() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10&_page=0"
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // create a key called "posts"
  const { data } = useQuery("posts", fetchPosts);
  // since fetchPosts is async data will be undefined until the promise resolves
  // so we need to check if data is undefined and return a loading message if it is
  // the component will re-render when the promise resolves and data will be defined
  if (!data) return <p>Loading...</p>;

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
