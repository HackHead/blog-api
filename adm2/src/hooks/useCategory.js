import { useState } from "react";

const useCategory = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});

    return {
        categories,
        selectedCategory,
        setCategories,
        setSelectedCategory,
    }
}

export default useCategory;