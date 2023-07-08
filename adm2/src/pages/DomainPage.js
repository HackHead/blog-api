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
import DomainCreationModal from '../components/DomainCreationModal/index';

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
  { id: 'name', label: 'Url', alignRight: false },
  { id: 'status', label: 'Ip', alignRight: false },
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

  const [openCreationModal, setOpenCreationModal] = useState(false);

  const [domains, setDomains] = useState([]);


  const [selectedDomain, setSelectedDomain] = useState(null);

  const [isLoading, setLoading] = useState(true);

  const [editableData, setEditableData] = useState(null)
  
  const handleOpenMenu = (event, domain, data) => {
    setOpen(event.currentTarget);
    if(data.id){
      setEditableData(data)
    }
    setSelectedDomain(domain)
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

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const res = await server.get(`/domains`)

      const data = res.data.data

      setDomains(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDomains();
  }, [page, limit])

  const destroyDomain = async () => {
    handleCloseMenu()
    try {
      setLoading(true);
      await server.delete(`/domains/${selectedDomain}`)
      await fetchDomains();
    } catch (error) {
      console.log('An error occured')
    } finally {
      setLoading(false);
    }
  }

  const handleModalClose = () => {
    setOpenCreationModal(false);
    setEditableData(null);
  };
  return (
    <>
      <Helmet>
        <title> Список доменов </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Домены
          </Typography>
          <Button variant="contained" onClick={() => {setOpenCreationModal(true); setEditableData(null); }} startIcon={<Iconify icon="eva:plus-fill" />}>
            Добавить домен
          </Button>
        </Stack>
        <DomainCreationModal 
          open={openCreationModal}
          onClose={handleModalClose} // Update this line
          onCreate={() => fetchDomains()}
          onSave={() => fetchDomains()}
          data={editableData}/>
        <Card>

          <>
            {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}
            {
              !isLoading ?
                <><Scrollbar>
                  <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                      <CategoryListHead
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={domains?.length}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        onSelectAllClick={handleSelectAllClick}
                      />
                      
                     {
                      <TableBody>
                        {domains.map((row) => {
                          const { id, name, url, ip_address: ipAddress } = row;

                          return (
                            <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={false}>
                              <TableCell align="center">{id}</TableCell>
                              <TableCell align="center">{url}</TableCell>
                              <TableCell align="center">{ipAddress}</TableCell>
                              <TableCell align="right">
                                <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, id, {id, url, ipAddress})}>
                                  <Iconify icon={'eva:more-vertical-fill'} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                     }
                        

                      {!domains.length && (
                        <TableBody>
                          <TableRow sx={{py: '3rem'}}>
                            <TableCell align="center" colSpan={6} sx={{ py: '7rem' }}>
                              <Paper
                                sx={{
                                  textAlign: 'center',
                                }}
                              >
                                <Typography variant="subtitle1" paragraph>
                                  Вы еще не добавили ни одного домена
                                </Typography>

                                <Typography variant="">
                                  Нажмите на кнопку "Добавить домен" <br/>
                                </Typography>
                              </Paper>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </Scrollbar>

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
        <MenuItem onClick={() => {setOpenCreationModal(true); handleCloseMenu()}}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Изменить
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={() => { destroyDomain();handleCloseMenu() }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Удалить
        </MenuItem>
      </Popover>
    </>
  );
}
