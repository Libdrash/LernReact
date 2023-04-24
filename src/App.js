import React, { useState, useEffect } from 'react';
import { usePosts } from './hooks/usePost';
import './styles/App.css';
import PostList from './components/PostList';
import MyButton from './components/UI/button/MyButton';
import PostForm from './components/PostForm';
import PostFilter from './components/PostFilter';
import MyModal from './components/MyModal/MyModal';
import PostService from './API/PostService';
import Loader from './components/UI/loader/Loader';
import { useFetching } from './hooks/useFetching';
import { getPageCount, getPagesArray } from './utils/pages';

function App() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({ sort: '', query: '' });
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
  let pagesArray = getPagesArray(totalPages);
  const handleChangePage = page => {
    setPage(page);
    fetchPosts();
  };

  const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
    const response = await PostService.getAll(limit, page);
    setPosts(response.data);
    const totalCount = response.headers['x-total-count'];
    setTotalPages(getPageCount(totalCount, limit));
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = newPost => {
    setPosts([...posts, newPost]);
    setModal(false);
  };

  const removePost = post => {
    setPosts(posts.filter(p => p.id !== post.id));
  };

  // const sortedPosts = useMemo(() => {
  //   if (filter.sort) {
  //     return [...posts].sort((a, b) =>
  //       a[filter.sort].localeCompare(b[filter.sort]),
  //     );
  //   }
  //   return posts;
  // }, [filter.sort, posts]);

  // const sortAndSearchedPosts = useMemo(() => {
  //   return sortedPosts.filter((post) =>
  //     post.title.toLowerCase().includes(filter.query.toLowerCase()),
  //   );
  // }, [filter.query, sortedPosts]);

  return (
    <div className='App'>
      <button onClick={fetchPosts}>Get Posts</button>
      <MyButton
        style={{ marginTop: '15px' }}
        onClick={() => {
          setModal(true);
        }}
      >
        Create
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        {' '}
        <PostForm create={createPost} />
      </MyModal>
      <PostFilter filter={filter} setFilter={setFilter} />

      {postError && <h1>Error ${postError}</h1>}
      {isPostsLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '50px',
          }}
        >
          <Loader>Loading...</Loader>
        </div>
      ) : (
        <PostList
          title={'List'}
          countPosts={posts.length}
          posts={sortedAndSearchedPosts}
          remove={removePost}
        />
      )}
      <div className='page__wrapper'>
        {pagesArray.map(p => (
          <span
            onClick={() => handleChangePage(p)}
            key={p}
            className={page === p ? 'page page__current' : 'page'}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
