    import { useLocation, useNavigate, } from "react-router-dom";
    import { Grid, TextField, FormControl, Card, InputLabel, Select, MenuItem, Button, makeStyles } from "@mui/material";
    import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
    import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
    import { useState, useEffect, useCallback, useRef, useMemo } from "react";
    import { v4 as uuidv4 } from 'uuid';
    import Joi from "joi";
    import SimpleMdeReact from "react-simplemde-editor";
    import "easymde/dist/easymde.min.css";

    

 
    const ArticleEditingForm = ({defaultData, languageId, onUpdate}) => {
        const editorRef = useRef(null)
          const editorOptions = useMemo(() => {
            return {
                autofocus: true, 
                spellChecker: false, 
                toolbar: [ "bold",
                "italic",
                "heading",
                "code",
                "quote",
                "unordered-list",
                "ordered-list",
                "link",
                "image",'strikethrough', 'code', 'table', 'redo', 'heading', 'undo', 'heading-bigger', 'heading-smaller', 'heading-1', 'heading-2', 'heading-3', 'clean-block']
        };
          }, []);
        const [id, setId] = useState(defaultData?.id || uuidv4());
        const [title, setTitle] = useState(defaultData?.title || '');
        const [excerpt, setExcerpt] = useState(defaultData?.excerpt || '');
        const [pubDate, setPubDate] = useState(defaultData?.pub_date ? new Date(defaultData?.pub_date) : new Date());
        const [body, setBody] = useState(defaultData?.body || '');

        const onBodyChange = useCallback((value) => {
            setBody(value);
        }, []);
        
        useEffect(() => {
            onUpdate({
                id,
                title,
                excerpt,
                pub_date: pubDate,
                body
            })
        }, [title, pubDate, excerpt, body, id])
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
                        multiline
                        fullWidth
                        rows={4}
                        maxRows={4}
                        label={'Описание'}
                        value={excerpt}
                        onChange={(e) => { setExcerpt(e.target.value)}}
                        sx={{ mt: '2rem' }}
                    />
                    <Grid container spacing={2} justifyContent="space-between">
                        <Grid item xs={12} lg={6} sx={{ mt: '1rem' }}>
                            <FormControl fullWidth>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker
                                        label="Время публикации"
                                        value={pubDate}
                                        onChange={(newDate) => {setPubDate(newDate)}}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                    </Grid>



                    <Grid sx={{ mt: '1rem' }}>
                        <SimpleMdeReact value={body} onChange={ (value) => {onBodyChange(value)} } options={editorOptions} ref={editorRef}/>
                    </Grid>

                </Grid>
            </Card>
        )
    }

    export default ArticleEditingForm;