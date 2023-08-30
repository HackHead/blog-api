import { useState } from "react";

const useFilter = () => {
    const [limit, setLimit] = useState(24);
    const [page, setPage] = useState(0);
    const [dateFrom, setDateFrom] = useState();
    const [dateTo, setDateTo] = useState();
    const [categoryId, setCategoryId] = useState('');
    
    return {
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
    }
}

export default useFilter;