import { useContext, useEffect, useState } from 'react';

import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Button, Container, Stack, Typography, TablePagination, CircularProgress, TableBody, TableRow, TableCell, Paper, Table, Tab, Tabs } from '@mui/material';

// components
import Snackbar from '@mui/material/Snackbar';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import qs from 'qs';

import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';

import server from '../http';
import LocaleContext from '../contexts/LocaleContext';
import ArticleFilters from '../components/ArticleFilters';
import useBlog from '../hooks/useBlog';
import useCategory from '../hooks/useCategory';
import useFilters from '../hooks/useFilters';


export default function BlogPage() {
  const go = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {locale} = useParams();
  const {selectedLanguage, handleLocaleChange} = useContext(LocaleContext)
  
 

  const [total, setTotal] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const {
    posts,
    setPosts
  } = useBlog();
  
  const {
    limit,
    setLimit,
    page,
    setPage,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    categoryId,
    setCategoryId,
} = useFilters();
  
  const {
    categories,
    setCategories,
  } = useCategory()

  const [isFetching, setFetching] = useState(false);


  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setLimit(event.target.value)
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const fetchPosts = async () => {
    setFetching(true);
    try {
      const query = qs.stringify({
        limit,
        page: page + 1,
        lang: selectedLanguage.code,
        categories: categoryId,
        dateFrom,
        dateTo,
      })

      const res = await server.get(`/articles?${query}`);

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

  const labelDisplayedRows = ({ from, to, count }) => (`${from}-${to} of ${count}`);

  const fetchCategories = async () => {
    try {
      const res = await server.get(`/categories`);

      const data = res.data.data;
      setCategories(data)
    } catch (error) {
      console.log(error)
    }
  }  

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue); 
    if(newValue > 0){
      setCategoryId(categories[newValue - 1].id)
    } else {
      setCategoryId('')
    }
  };

  const handleDateChange= (newFromDate, newToDate) => {
    setDateFrom(newFromDate);
    setDateTo(newToDate);
  }
  
  useEffect(() => {
    if(!Object.keys(selectedLanguage).length){ return; }
    fetchPosts();
    fetchCategories();
  }, [page, limit, selectedLanguage, dateFrom, dateTo, categoryId]);
  
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
          <Button onClick={() => go('/article/new')} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} sx={{boxShadow: 'none'}}>
            Создать статью
          </Button>
        </Stack>
        <ArticleFilters onUpdate={handleDateChange}/>
        <Stack mx={{marginBottom: '1rem'}}>
          <Tabs
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
              value={selectedTab}
              onChange={handleTabChange}
            >
              <Tab label={'All'}/>
              {categories.map((category) => {
                return  <Tab key={category.id} label={category.name}/>
              })}
            </Tabs>
        </Stack>
        {
          isFetching ?
            <Grid container alignItems="center"
              justifyContent="center"
              sx={{ minHeight: '400px' }}>
              <Grid item><CircularProgress /></Grid>
            </Grid>
            : (
              <>
                {
                  posts.length ? (
                    <>
                      <Grid container spacing={3}>
                        {posts.map((post, index) => (
                          <BlogPostCard key={post.id} post={post} index={index} />
                        ))}
                      </Grid>
                      <TablePagination
                        rowsPerPageOptions={[24, 48, 96]}
                        component="div"
                        count={total}
                        rowsPerPage={limit}
                        page={page}
                        onPageChange={(e, page) => setPage(page)}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={'На странице'}
                        labelDisplayedRows={labelDisplayedRows}
                      />
                    </>
                  ) : (
                    <Table>
                      <TableBody style={{ display: 'flex', justifyContent: 'center' }}>
                      <TableRow sx={{ py: '3rem' }}>
                        <TableCell align="center" colSpan={6} sx={{ py: '7rem' }}>
                          <Paper
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="subtitle1" paragraph>
                              Вы еще не добавили ни одной сттаьи
                            </Typography>

                            <Typography variant="">
                              Нажмите на кнопку "Создать статью" <br />
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                    </Table>
                  )
                }
              </>
            )
        }
      </Container>
    </>
  );
}
