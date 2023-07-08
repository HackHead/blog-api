import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import emojiFlags from 'emoji-flags';
import ReactDom from 'react-dom'

// @mui
import {
  Stack,
  Button,
  MenuItem,
  Container,
  Typography,
  CircularProgress,
  Grid,
  Alert,
  AlertTitle,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Divider

} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Joi from 'joi';
import SimpleMdeReact from "react-simplemde-editor";
import ReactMarkdown from "react-markdown";

import ArticleCreationForm from '../components/ArticleCreationForm';
import ArticleDestroyModal from '../components/ArticleDestroyModal/index';

// components
import USERLIST from '../_mock/user';
import server from '../http';
import DropZone from '../components/DropZone/DropZone';

import "easymde/dist/easymde.min.css";
// ----------------------------------------------------------------------

export default function ArticlePreview() {
  const go = useNavigate();
  const {id} = useParams();
  const [isLoading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [pubDate, setPubDate] = useState(new Date());
  const [body, setBody] = useState('');
  
  const fetchAricle = async () => {
    try {
      const res = await server.get(`/articles/${id}`);

      const data = res.data.data;

      if(!data) { go('/dashboard/blog'); return;  }

      setTitle(data.title);
      setExcerpt(data.excerpt);
      setBody(data.body);
      setPubDate(data.pub_date);
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchAricle();
  }, [])
  return (
    <>
      <Helmet>
        <title> Список категорий </title>
      </Helmet>
      {
        isLoading ?
          <Grid container alignItems="center" justifyContent="center" sx={{ minHeight: '400px' }}>
            <Grid item><CircularProgress /></Grid>
          </Grid>
          : <Container>
            {/* <Typography variant='h1'>
              <span>{title}</span>
            </Typography>
            <Typography variant='body'>
              <span>{pubDate}</span>
            </Typography> */}

             <ReactMarkdown>{body}</ReactMarkdown>
             sew
          </Container>
      }
    </>
  );
}
