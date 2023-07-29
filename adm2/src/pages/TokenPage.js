import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
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
  Modal,
  Grid,
  CircularProgress,
  Chip
} from '@mui/material';

// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';

import TokenModal from '../components/TokenModal'
import server from '../http';
import TokenListHead from '../sections/@dashboard/user/TokenListHead';
// ----------------------------------------------------------------------


const TABLE_HEAD = [
  // { id: 'name', label: 'id', alignRight: false },
  { id: 'company', label: 'Название', alignRight: false },
  { id: 'role', label: 'Описание', alignRight: false },
  { id: 'isVerified', label: 'Доступ', alignRight: false },
  { id: 'status', label: 'Срок действия', alignRight: false },
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

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [openTokenModal, setOpenTokenModal] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [tokens, setTokens] = useState([]);

  const [isLoading, setLoading] = useState(true);

  const [selectedTokenId, setSelectedTokenId] = useState(null);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const res = await server.get('/tokens');

      const data = res.data.data;

      setTokens(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const destroyToken = async () => {
    handleCloseMenu()
    try {
      setLoading(true);
      await server.delete(`/tokens/${selectedTokenId}`)
      await fetchTokens();
    } catch (error) {
      console.log('An error occured')
    } finally {
      setLoading(false);
    }
  }
  
  const handleOpenMenu = (event, tokenId) => {
    setOpen(event.currentTarget);
    setSelectedTokenId(tokenId);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setSelectedTokenId(null);
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

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

 
  
  

  useEffect(() => {
    fetchTokens();
  }, [])

  return (
    <>
      <Helmet>
        <title> Список токенов </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Токены
          </Typography>
          <Button variant="contained" onClick={() => setOpenTokenModal(true)} startIcon={<Iconify icon="eva:plus-fill" />} sx={{boxShadow: 'none'}}>
            Создать токен
          </Button>
        </Stack>
        <Card>
          {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}
          <TokenModal open={openTokenModal} onClose={() => {setOpenTokenModal(false)}} onCreate={() => {fetchTokens()}}/>
          {
            !isLoading ?
              <>
                <Scrollbar>
                  <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                      <TokenListHead
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={USERLIST.length}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        onSelectAllClick={handleSelectAllClick}
                      />
                      <TableBody>
                        {tokens.map((row) => {
                          const { id, description, expirationDate, name, accessRights } = row;
                          const selectedUser = selected.indexOf(name) !== -1;

                          return (
                            <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser} >
                              {/* <TableCell component="th" scope="row" padding="none" alignItems="center"> 
                                <Stack direction="row" alignItems="center" spacing={2} sx={{px: '1rem'}}>
                                  <Typography variant="subtitle2" noWrap>
                                    {id}
                                  </Typography>
                                </Stack>
                              </TableCell> */}

                              <TableCell align="center">{name}</TableCell>
                              <TableCell align="center">
                                {description || '-'}
                              </TableCell>
                              <TableCell align="center">{accessRights === 'fullAccess' ? <Chip label="Полный доступ" color="success" variant="outlined" /> : <Chip label="Только чтение" color="warning" variant="outlined" />}</TableCell>

                              <TableCell align="center">
                                <Typography variant="subtitle2" noWrap>
                                  {expirationDate || 'Бессрочно'}
                                  </Typography>
                                </TableCell>



                              <TableCell align="right">
                                <IconButton size="large" color="inherit" onClick={(e) => {handleOpenMenu(e, id)}}>
                                  <Iconify icon={'eva:more-vertical-fill'} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>




                      {!tokens.length && (
                        <TableBody>
                          <TableRow sx={{py: '3rem'}}>
                            <TableCell align="center" colSpan={6} sx={{ py: '7rem' }}>
                              <Paper
                                sx={{
                                  textAlign: 'center',
                                }}
                              >
                                <Typography variant="subtitle1" paragraph>
                                  Вы еще не создали ни одного API токена
                                </Typography>

                                <Typography variant="">
                                  Нажмите на кнопку "Создать токен" <br/>
                                  добавьте имя, описание и права доступа
                                </Typography>
                              </Paper>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </Scrollbar>
              </> :
              <Grid container alignItems="center"
                justifyContent="center"
                sx={{ minHeight: '400px' }}>
                <Grid item><CircularProgress /></Grid>
              </Grid>
          }

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
        <MenuItem sx={{ color: 'error.main' }} onClick={() => {destroyToken(); }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Удалить
        </MenuItem>
      </Popover>
    </>
  );
}
