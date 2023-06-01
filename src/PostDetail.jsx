import { useQuery, useMutation } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // having the query key be an array means that each post will have its own cache
  const q = useQuery(["comments", post.id], () => fetchComments(post.id), {
    staleTime: 10000,
  });

  // useMutation can accept an argument
  // jsonplaceholder doesn't actually delete/update posts
  // so this example just shows how to use useMutation
  const deleteMutation = useMutation((postId) => deletePost(postId));
  const updateMutation = useMutation((postId) => updatePost(postId));

  if (q.isLoading) return <h3>Loading...</h3>;
  if (q.isError)
    return (
      <>
        <h3>Error</h3>
        <p>{q.error.message}</p>
      </>
    );

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isError && (
        <p style={{ color: "red" }}>{deleteMutation.error.message}</p>
      )}
      {deleteMutation.isLoading && (
        <p style={{ color: "purple" }}>Deleting...</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: "green" }}>Post deleted successfully!</p>
      )}
      <button onClick={() => updateMutation.mutate(post.id)}>Update title</button>
      {updateMutation.isError && (
        <p style={{ color: "red" }}>{updateMutation.error.message}</p>
      )}
      {updateMutation.isLoading && (
        <p style={{ color: "purple" }}>Updating...</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{ color: "green" }}>Post updated successfully!</p>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {q.data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
