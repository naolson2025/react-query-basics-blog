import { useEffect, useState } from "react";

import { PostDetail } from "./PostDetail";
import { useQuery, useQueryClient } from "react-query";

const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  // creating another query client to prefetch the next page of posts
  const queryClient = useQueryClient();

  useEffect(() => {
    if(currentPage < maxPostPage) {
      queryClient.prefetchQuery(
        ["posts", currentPage + 1],
        () => fetchPosts(currentPage + 1)
      );
    }
  }, [currentPage, queryClient]);

  // create a key called "posts"
  // default is for data to be stale after 0 seconds
  const { data, isError, error, isLoading } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 10000,
      // this will keep the previous pagination data in the cache
      keepPreviousData: true,
    }
  );
  // since fetchPosts is async data will be undefined until the promise resolves
  // so we need to check if isLoading is true and return a loading message if it is
  // the component will re-render when the promise resolves and data will be defined
  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>Error</h3>
        <p>{error.message}</p>
      </>
    );

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
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prevValue) => prevValue - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prevValue) => prevValue + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
