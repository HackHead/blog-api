import { useEffect, useState } from 'react';

import server from '../http';

const useLocale = () => {
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState({});
    const fetchAllLanguages = async () => {
        try {
          const response = await server.get('/languages');
    
          const listOfLanguages = response.data.data;
          
          if(listOfLanguages.length){ 
            setSelectedLanguage(listOfLanguages[0]);
            setAvailableLanguages(listOfLanguages);
           }
        } catch (error) {
          console.log(error)
        }
    }

    const handleLocaleChange = (newCode) => {
      setSelectedLanguage(availableLanguages.find(({code}) => code === newCode))
    }
    
    useEffect(() => {
      fetchAllLanguages();
    }, []);
    
    return {
        availableLanguages,
        selectedLanguage,
        setSelectedLanguage,
        handleLocaleChange
    }
}

export default useLocale;