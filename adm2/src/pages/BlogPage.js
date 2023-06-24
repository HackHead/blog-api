import { useEffect, useState } from 'react';

import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Button, Container, Stack, Typography, TablePagination, CircularProgress } from '@mui/material';
// components
import Snackbar from '@mui/material/Snackbar';

import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock
import POSTS from '../_mock/blog';
import USERLIST from '../_mock/user';
import server from '../http';
// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function BlogPage() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [posts, setPosts] = useState([]);
  const [isFetching, setFetching] = useState(false);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const fetchPosts = async () => {
    setFetching(true);
    try {
      const res = await server.get('/articles');

      const data = res.data.data;

      setPosts(data);
      setTotal(res.data.meta.total);
      setLimit(res.data.meta.limit);
    } catch (error) {
      console.log(error)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [page])
  return (
    <>
      <Helmet>
        <title> Dashboard: Blog | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Статьи
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Добавить статью
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>


        {
          posts.length ?
            <>
            <Grid container spacing={3}>
              {posts.map((post, index) => (
                <BlogPostCard key={post.id} post={post} index={index} />
              ))}
            </Grid>
            <TablePagination
            rowsPerPageOptions={[15, 50, 100]}
            component="div"
            count={total}
            rowsPerPage={limit}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={'На странице'}
          />
            </>
            : <Grid container alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '400px' }}>
              <Grid item><CircularProgress /></Grid>
            </Grid>
        }
        
      </Container>
    </>
  );
}
