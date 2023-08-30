    import { useLocation, useNavigate, } from "react-router-dom";
    import { Grid, TextField, FormControl, Card, InputLabel, Select, MenuItem, Button } from "@mui/material";
    import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
    import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
    import { useState, useEffect, useCallback } from "react";
    import Joi from "joi";
    import SimpleMdeReact from "react-simplemde-editor";
    import "easymde/dist/easymde.min.css";

    const ArticleCreationForm = ({ onUpdate, languageId}) => {

        const [title, setTitle] = useState('');
        const [excerpt, setExcerpt] = useState('');
        const [pubDate, setPubDate] = useState(new Date());
        const [body, setBody] = useState('');
        const [author_name, setAuthorName] = useState('');

        const onBodyChange = useCallback((value) => {
            setBody(value);
        }, []);
        
        const isValidTranslation = () => {
            const translationSchema = Joi.object({
                title: Joi.string().optional(),
                author_name: Joi.string().optional(),
                languageId: Joi.string().uuid().optional(),
                excerpt: Joi.string().optional(),
                pub_date: Joi.date().optional(),
                body: Joi.string().max(65536).optional(),
              })

            return translationSchema.validate({
                title,
                excerpt,
                pub_date: pubDate,
                body,
                languageId,
                author_name,
            })
        }
        
        useEffect(() => {
            console.log('updated..')
            onUpdate({
                title,
                pub_date: pubDate,
                body,
                excerpt,
                languageId,
                author_name
            })
        }, [title, body, pubDate, excerpt, author_name]);
        return (
            <Card sx={{ padding: '1rem' }} className="disabled">
                <Grid item xs={12}>
                    <TextField
                        label="Заголовок"
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={(e) => { setTitle(e.target.value) }}
                    />
                   <TextField
                        label="Имя автора"
                        variant="outlined"
                        fullWidth
                        value={author_name}
                        onChange={(e) => { setAuthorName(e.target.value) }}
                        sx={{ mt: '1rem' }}
                    />
                    <TextField
                        multiline
                        fullWidth
                        rows={4}
                        maxRows={4}
                        label={'Описание'}
                        value={excerpt}
                        onChange={(e) => { setExcerpt(e.target.value)}}
                        sx={{ mt: '1rem', borderColor: 'black' }}
                    />
                    <Grid container spacing={2} justifyContent="space-between">
                        <Grid item xs={12} lg={6} sx={{ mt: '1rem' }}>
                            <FormControl fullWidth>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker
                                        label="Время публикации"
                                        value={pubDate}
                                        onChange={(newDate) => {setPubDate(newDate)}}
                                        minDate={new Date()}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                    </Grid>



                    <Grid sx={{ mt: '1rem' }}>
                        <SimpleMdeReact value={body} onChange={(value) => {onBodyChange(value)} } />
                    </Grid>

                </Grid>
                {/* <Grid item sx={{ display: 'flex', justifyContent: 'center', mt: '1.5rem' }}>
                    <Button variant="contained" color="info" onClick={() => console.log(isValidTranslationBody())}>Сохранить</Button>
                </Grid> */}
            </Card>
        )
    }

    export default ArticleCreationForm;