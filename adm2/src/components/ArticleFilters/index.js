import { useEffect, useState } from "react";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box } from "@mui/material";


const ArticleFilters = ({onUpdate}) => {
    const [from, setFrom] = useState(new Date('1971-01-01'));
    const [to, setTo] = useState(new Date());
    
    useEffect(() => {
        onUpdate(from ,to)
    }, [from ,to])
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: '1rem auto' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        label="От"
                        value={from}
                        onChange={(newDate) => {setFrom(newDate)}}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        label="До"
                        value={to}
                        onChange={(newDate) => {setTo(newDate)}}
                        />
                </LocalizationProvider>
            </Box>
        </>
    )
}

export default ArticleFilters;