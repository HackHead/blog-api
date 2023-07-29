import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import emojiFlags from 'emoji-flags';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  CircularProgress,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import CategoryCreationModal from '../components/CategoryCreationModal';

// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import server from '../http';
import CategoryListHead from '../sections/@dashboard/user/CategoryListHead';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'name', label: 'Название', alignRight: false },
  { id: 'status', label: 'Доступные переводы', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}


export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(5);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openCreationModal, setOpenCreationModal] = useState(false);

  const [categories, setCategories] = useState([]);

  const [total, setTotal] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isLoading, setLoading] = useState(true);

  const [editableId, setEditableId] = useState(null);

  const handleOpenMenu = (event, categoryId) => {
    setOpen(event.currentTarget);
    setEditableId(categoryId)
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setLimit(parseInt(event.target.value, 10))
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await server.get(`/categories?page=${page + 1}&limit=${limit}`)

      const data = res.data.data

      setCategories(data)
      setTotal(res.data.meta.total)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [page, limit])

  const destroyCategory = async () => {
    handleCloseMenu()
    try {
      setLoading(true);
      await server.delete(`/categories/${editableId}`)
      await fetchCategories();
    } catch (error) {
      console.log('An error occured')
    } finally {
      setLoading(false);
    }
  }
  const handleCloseModal = () => {
    setOpenCreationModal(false)
    setEditableId(null)
  }
  return (
    <>
      <Helmet>
        <title> Список категорий </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Категории
          </Typography>
          <Button variant="contained" onClick={() => setOpenCreationModal(true)} startIcon={<Iconify icon="eva:plus-fill" />} sx={{boxShadow: 'none'}}>
            Добавить категорию
          </Button>
        </Stack>
        <CategoryCreationModal
          open={openCreationModal}
          onClose={() => handleCloseModal()}
          onCreate={() => fetchCategories()}
          data={editableId ? categories.filter(({ id }) => id === editableId) : null}
        />
        <Card>
          <>
            {
              !isLoading ?
                <><Scrollbar>
                  <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                      <CategoryListHead
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={total}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        onSelectAllClick={handleSelectAllClick}
                      />

                      {!categories.length ? (
                        <TableBody>
                          <TableRow sx={{ py: '3rem' }}>
                            <TableCell align="center" colSpan={6} sx={{ py: '7rem' }}>
                              <Paper
                                sx={{
                                  textAlign: 'center',
                                }}
                              >
                                <Typography variant="subtitle1" paragraph>
                                  Вы еще не добавили ни одной категории
                                </Typography>

                                <Typography variant="">
                                  Нажмите на кнопку "Создать категорию" <br />
                                </Typography>
                              </Paper>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      ) : (<TableBody>
                        {categories.length && categories.map((row) => {
                          const { id, name, locale } = row;

                          return (
                            <TableRow hover key={id} tabIndex={-1} >
                              <TableCell align="center">{id}</TableCell>
                              <TableCell align="center">{name}</TableCell>

                              <TableCell align="center">
                                {
                                  Object.entries(locale).length ? Object.entries(locale).map(([code, data]) => {
                                    return (<span key={data.id} className={`flag-${code}`} style={{ fontSize: '1.4rem', cursor: 'pointer' }} title={data.language.name}>  </span>);
                                  }) : '-'
                                }
                              </TableCell>

                              <TableCell align="right">
                                <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, id)}>
                                  <Iconify icon={'eva:more-vertical-fill'} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>)
                    }

                    </Table>
                  </TableContainer>
                </Scrollbar>

                  {
                    categories.length ? (
                      <TablePagination
                        rowsPerPageOptions={[5, 15, 30]}
                        component="div"
                        count={total}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={'На странице'}
                      />
                    ) : null
                  }
                  </> : (<Grid container alignItems="center"
                    justifyContent="center"
                    sx={{ minHeight: '400px' }}>
                    <Grid item><CircularProgress /></Grid>
                  </Grid>)
            }
          </>

        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => { setOpenCreationModal(true); handleCloseMenu(true) }}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Изменить
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={() => { destroyCategory(); }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Удалить
        </MenuItem>
      </Popover>
    </>
  );
}
