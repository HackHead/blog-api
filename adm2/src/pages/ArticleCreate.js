import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useContext, useEffect, useState } from 'react';
import emojiFlags from 'emoji-flags';

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
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';

import Joi from 'joi';

import ArticleCreationForm from '../components/ArticleCreationForm';
import ArticleDestroyModal from '../components/ArticleDestroyModal/index';

// components
import server from '../http';
import DropZone from '../components/DropZone/DropZone';
import AuthContext from '../contexts/AuthContext';

// ----------------------------------------------------------------------

export default function ArticleCreate() {
  const isNewArticle = useLocation().pathname === '/article/new';
  const go = useNavigate();
  const { id } = useParams();

  const {user} = useContext(AuthContext);
  
  const [localizations, setLocalizations] = useState([]);

  const [openDestroyModal, setOpenDestroyModal] = useState(false);

  // Выбранный домен
  const [selectedDomain, setSelectedDomain] = useState('');

  // Выбранный язык
  const [selectedLang, setSelectedLang] = useState('');

  // Выбранная категория
  const [selectedCategory, setSelectedCategory] = useState('');

  // UI название поста
  const [articleName, setArticleName] = useState('');

  // Список языков (получаем с сервера)
  const [languages, setLanguages] = useState([]);

  // Список категорияй (получаем с сервера)
  const [categories, setCategories] = useState([]);

  // Список доменов (получаем с сервера)
  const [domains, setDomains] = useState([]);

  const [thumbnail, setThumbnail] = useState('')
  // Если страница - редактировать, то здесь храниться первоначальные данный поста

  // Boolean в котором храниться информация о том происходит ли сейчас какой либо запрос на сервер
  const [isLoading, setLoading] = useState(true);

  // Список сообщений (ошибки, успешние, предупреждения)
  const [alerts, setAlerts] = useState([]);

  // Здесь храниться файл с DropZone
  const [file, setFile] = useState();
  const [alt, setAlt] = useState('');
  // Валидация данных общих данных статьи

  

  

  const isValidArticle = (body) => {
    const articleShema = Joi.object({
      name: Joi.string().required(),
      categoryId: Joi.string().uuid().required(),
      domainId: Joi.string().allow(false).uuid().optional(),
      alt: Joi.string().min(2).required(),
    });

    return articleShema.validate(body)
  }


  const uploadThumbnail = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', alt);

      const res = await server.post('/uploads', formData);
      
      return res.data.data;
    } catch (error) {
      setAlerts([...alerts, { id: Date.now(), title: 'Ошибка', content: 'Во время загрузки изображения произошла ошибка', severity: 'error' }])
      return null;
    }
  }

  const createArticle = async () => {
    try {

      setLoading(true);
      const { error } = isValidArticle({
        name: articleName,
        categoryId: selectedCategory,
        domainId: selectedDomain,
        alt,
      })
      if(error){
        setAlerts([...alerts, { id: Date.now(), title: 'Ошибка', content: error.details[0].message, severity: 'error' }])
        return;
      }

      const uploadedImage = await uploadThumbnail();
      const thumbnailId = uploadedImage.id;

      if (error) {
        const errorMessage = <strong>{error.message}</strong>
        setAlerts([
          ...alerts,
          { id: Date.now(), title: 'Ошибка! Проверьте правильность введенных данных', content: errorMessage, severity: 'error' }
        ])
        return;
      }

      const res = await server.post('/articles', {
        name: articleName,
        thumbnailId,
        categoryId: selectedCategory,
        domainId: selectedDomain || null,
        authorId: user.id,
        translations: localizations
      })

      const data = res.data.data;

      const successMessage = (
        <strong>
          <Link to={`/article/${data.article.id}`} className='simpe-link'>
            Редактировать
          </Link>
        </strong>
      )

      setAlerts([{ id: Date.now(), title: 'Статья успешно создана', content: successMessage, severity: 'success' }])
      setArticleName('')
    } catch (error) {
      const errorMessage = <strong>{error.response.data.error.message}</strong>
      setAlerts([{ id: Date.now(), title: 'Серверная ошибка', content: errorMessage, severity: 'error' }])
    } finally {
      setLoading(false);
    }


  }


  const fetchLanguages = async () => {
    try {
      const res = await server.get('/languages');

      const data = res.data.data;

      setSelectedLang(data[0].code)
      setLanguages(data);
    } catch (error) {
      const errorMessage = <strong>{error.response.data.error.message}</strong>
      setAlerts([...alerts, { id: Date.now(), title: 'Серверная ошибка', content: errorMessage, severity: 'error' }])
    }
  }

  const fetchDomains = async () => {
    try {
      const res = await server.get('/domains');

      const data = res.data.data

      setDomains(data);
      if (data.length && isNewArticle) {
        setSelectedDomain(data[0].id)
      }
    } catch (error) {
      const errorMessage = <strong>{error.response.data.error.message}</strong>
      setAlerts([...alerts, { id: Date.now(), title: 'Серверная ошибка', content: errorMessage, severity: 'error' }])
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await server.get('/categories');

      const data = res.data.data

      if(!data.length){
        go('/category')
      }
      
      setCategories(data);
      setSelectedCategory(data[0].id)
    } catch (error) {
      const errorMessage = <strong>{error.response.data.error.message}</strong>
      setAlerts([...alerts, { id: Date.now(), title: 'Серверная ошибка', content: errorMessage, severity: 'error' }])
    }
  }

  const fetchData = async () => {
    setLoading(true);

    await Promise.all([
      fetchCategories(),
      fetchLanguages(),
      fetchDomains(),
    ]);

      setLoading(false);
  }

  const handleLocalizationUpdate = (data) => {
    const idx = localizations.findIndex((loc) => loc.languageId === data.languageId);

    if (idx !== -1) {
      const updatedLocalizations = [...localizations];
      updatedLocalizations[idx] = data;
      setLocalizations(updatedLocalizations);
    } else {
      setLocalizations([...localizations, data]);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);


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
            <ArticleDestroyModal id={id} open={openDestroyModal} onClose={() => setOpenDestroyModal(false)} />
            <Stack>
              {
                alerts.map(({ id, title, content, severity }) => {
                  return (
                    <Alert key={id} severity={severity || 'info'} sx={{ mb: '1rem' }}>
                      <AlertTitle>{title}</AlertTitle>
                      {content}
                    </Alert>
                  )
                })
              }
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h4" gutterBottom>
                {isNewArticle ? 'Создать статью' : 'Редактировать статью'}
              </Typography>
              <Grid>
                {
                  isNewArticle ?
                    <></>
                    : <Button
                      onClick={() => setOpenDestroyModal(true)}
                      variant="contained"
                      color='error'
                      sx={{ mr: '1rem' }}>Удалить</Button>}

                {
                    <Button variant="contained" onClick={() => createArticle()}>
                      Сохранить
                    </Button>
                }

              </Grid>
            </Stack>
            <Grid container spacing={2}>

              <Grid item xs={4}>
                <FormControl fullWidth sx={{ mt: '1rem ' }}>
                  <InputLabel id="expiration-date-label">Языковая версия</InputLabel>

                  <Select
                    fullWidth
                    labelId="expiration-date-label"
                    id="demo-simple-select"
                    label="Языковая версия"
                    value={selectedLang}
                    onChange={(e) => {
                      setSelectedLang(e.target.value)
                    }}
                  >
                    {
                      languages.map((lang) => {
                        return (<MenuItem key={lang.id} value={lang.code}><span className={`flag-${lang.code}`} /><span>{lang.name}</span></MenuItem>)
                      }) || <MenuItem value={' '}>Языки отсутствуют</MenuItem>
                    }
                  </Select>
                </FormControl>
                <Divider sx={{ my: '1rem ' }} />
                <TextField
                  label="Название"
                  variant="outlined"
                  fullWidth
                  value={articleName}
                  onChange={(e) => { setArticleName(e.target.value) }}
                />


                <FormControl fullWidth sx={{ mt: '1rem ' }}>
                  <InputLabel id="expiration-date-label">Домен</InputLabel>
                  <Select
                    fullWidth
                    labelId="expiration-date-label"
                    id="demo-simple-select"
                    label="Домен"
                    value={selectedDomain}
                    onChange={(e) => {
                      setSelectedDomain(e.target.value)
                    }}
                  >
                    {
                      domains.map((domain) => {
                        return <MenuItem key={domain.id} value={domain.id}>{domain.url}</MenuItem>
                      })
                    }
                    <MenuItem value={false}>Отсутствует</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mt: '1rem ' }}>
                  <InputLabel id="expiration-date-label">Категория</InputLabel>
                  <Select
                    fullWidth
                    labelId="expiration-date-label"
                    id="demo-simple-select"
                    label="Категория"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {
                      categories.map((category) => {
                        return <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                      })
                    }
                  </Select>
                </FormControl>
                <Grid sx={{ mt: '1rem' }}>
                  <TextField
                    label="Альтернативный текст"
                    variant="outlined"
                    fullWidth
                    value={alt}
                    onChange={(e) => { setAlt(e.target.value) }}
                    sx={{mb: '1rem'}} 

                  />
                  <DropZone url={thumbnail} onUpdate={(uploadedFile) => setFile(uploadedFile)} />
                </Grid>
              </Grid>
              <Grid item xs={8}>
                {
                  languages.map((lang) => {
                    return (
                      <div
                        key={lang.id}
                        style={{ display: selectedLang === lang.code ? 'block' : 'none' }}
                      >
                        <ArticleCreationForm
                          languageId={lang.id}
                          onUpdate={(data) => handleLocalizationUpdate(data)}
                        />
                      </div>
                    );
                  })
                }

              </Grid>

            </Grid>
          </Container>
      }
    </>
  );
}
