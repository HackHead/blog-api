import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';


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
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';

import Joi from 'joi';

import ArticleCreationForm from '../components/ArticleCreationForm';
import ArticleDestroyModal from '../components/ArticleDestroyModal/index';

// components
import server from '../http';
import DropZone from '../components/DropZone/DropZone';
import ArticleEditingForm from '../components/ArticleEditingForm';
import AuthContext from '../contexts/AuthContext';

// ----------------------------------------------------------------------

export default function ArticleEdit() {
  const go = useNavigate();
  const { id } = useParams();
  const {user} = useContext(AuthContext);
  const [article, setArticle] = useState({});
  const [openDestroyModal, setOpenDestroyModal] = useState(false);

  const [validTranslations, setValidTranslations] = useState([]);
  
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

  // Boolean в котором храниться информация о том происходит ли сейчас какой либо запрос на сервер
  const [isLoading, setLoading] = useState(true);

  // Ссылка на загруженное изображение
  const [thumbnail, setThumbnail] = useState('');

  // Список сообщений (ошибки, успешние, предупреждения)
  const [alerts, setAlerts] = useState([]);

  // Здесь храниться файл с DropZone
  const [file, setFile] = useState();
  const [alt, setAlt] = useState('');
  // Валидация данных общих данных статьи

  const isValidTranslation = (body) => {
    const translationSchema = Joi.object({
      id: Joi.string().uuid().optional(), 
      title: Joi.string().min(1),
      excerpt: Joi.string().min(1),
      pub_date: Joi.date().required(),
      body: Joi.string().min(1).required(),
    })
    return translationSchema.validate(body)
  }


  const uploadThumbnail = async () => {
    try {
      const formData = new FormData();

      formData.append('file', file); 
      formData.append('alt', alt);

      const res = await server.post('/uploads', formData);

      return res.data.data;
    } catch (error) {
      setAlerts([...alerts, { id: Date.now(), title: 'Ошибка', content: error.response.data.error.message, severity: 'error' }])
      return null;
    }
  }

  const handleFormUpdate = (updatedData, languageId) => {
    const {value, error} = isValidTranslation(updatedData);
    if(error){
      console.log(error)
      return
    }
    updatedData.languageId = languageId
    const index = validTranslations.findIndex((trans) => trans.languageId === languageId);
    const validTranslationsCopy = [...validTranslations];

    if(index === -1) {
      validTranslationsCopy.push(updatedData)
    } else {
      validTranslationsCopy.splice(index, 1, updatedData)
    }

    setValidTranslations(validTranslationsCopy)
  }

  const updateThumbnailAlt = async () => {
    try {

      const res = await server.patch(`/thumbnail/${article.thumbnail.id}`, {
        alt
      });

      return res.data.data;
    } catch (error) {
      setAlerts([...alerts, { id: Date.now(), title: 'Ошибка', content: error.response.data.error.message, severity: 'error' }])
      return null;
    }
  }
  const saveArticle = async () => {
    try {
      setLoading(true);
      let uploadedImage;

      if (file) {
        uploadedImage = await uploadThumbnail();
      } else {
        const altThumbnail = await updateThumbnailAlt();
        if (altThumbnail === null) {
          return; 
        }
        uploadedImage = altThumbnail;
      }
      const thumbId = uploadedImage.id;
      const params = {
        name: articleName,
        categoryId: `${selectedCategory}`,
        domainId: selectedDomain || null,
        authorId: user.id,
        translations: validTranslations
      }
      if(thumbId){
        params.thumbnailId = thumbId
      }

      const res = await server.patch(`/articles/${id}`, {
        ...params,
      })
      
      const data = res.data.data;
      await fetchData();
      const successMessage = (
        <strong>
          <Link to={`/dashboard/blog`} className='simpe-link'>
            Смотреть другие статьи
          </Link>
        </strong>
      )

      setAlerts([{ id: Date.now(), title: 'Статья успешно изменена', content: successMessage, severity: 'success' }])
    } catch (error) {
      const errorMessage = (
        <strong>
          <Link to={`/dashboard/blog`} className='simpe-link'>
          {error.response.data.error.message}
          </Link>
        </strong>
      )

      setAlerts([{ id: Date.now(), title: 'Возникла ошибка!', content: errorMessage, severity: 'error' }])
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
    } catch (error) {
      const errorMessage = <strong>{error.response.data.error.message}</strong>
      setAlerts([...alerts, { id: Date.now(), title: 'Серверная ошибка', content: errorMessage, severity: 'error' }])
    }
  }

  const fetchArticle = async () => {
    try {
      const res = await server.get(`/articles/${id}`);

      const post = res.data.data;

      setArticle(post)
      setArticleName(post.name)
      
      const generateLocalization = Object.values(post.locale).map((item) => {
        const obj = {
          id: `${item.id}`,
          title: item.title,
          excerpt: item.excerpt,
          pub_date: item.pub_date,
          body: item.body,
          languageId: `${item.language.id}`
        }
        return obj;
      })

      setValidTranslations(generateLocalization)
      
      if(post?.thumbnail?.url){ setThumbnail(post?.thumbnail?.url);}
      if(post?.thumbnail?.alt){ setAlt(post?.thumbnail?.alt);}
      if(post?.domain){ setSelectedDomain(post.domain.id);}
      if(post?.category.id){ setSelectedCategory(post.category.id);}
    } catch (error) {
      go('/dashboard/blog')
    }
    setLoading(false)
  }

  const fetchCategories = async () => {
    try {
      const res = await server.get('/categories');

      const data = res.data.data

      setCategories(data);
    } catch (error) {
      const errorMessage = <strong>{error.response.data.error.message}</strong>
      setAlerts([...alerts, { id: Date.now(), title: 'Серверная ошибка', content: errorMessage, severity: 'error' }])
    }
  }

  async function fetchData() {
    setLoading(true);

    await Promise.all([
      fetchCategories(),
      fetchLanguages(),
      fetchDomains(),
      fetchArticle(),]);

      setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [useNavigate()]);


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
                {'Редактировать статью'}
              </Typography>
              <Grid>
              <Button
                      onClick={() => setOpenDestroyModal(true)}
                      variant="contained"
                      color='error'
                      sx={{ mr: '1rem' }}>Удалить</Button>

                  <Button variant="contained" onClick={() => saveArticle()}>
                      Обновить
                    </Button>

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
                        return <MenuItem key={lang.id} value={lang.code}><span className={`flag-${lang.code}`} />{lang.name}</MenuItem>
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
                  <DropZone url={thumbnail} onUpdate={(uploadedFile) => setFile(uploadedFile)}  />
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
                        <ArticleEditingForm defaultData={article?.locale[lang.code]} languageId={lang.id} onUpdate={(data) => handleFormUpdate(data, lang.id)} />
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
