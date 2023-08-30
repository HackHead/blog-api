import { useState } from "react";

const useBlog = () => {
    const [posts, setPosts] = useState([]);

    return {
        posts,
        setPosts,
    };
}

export default useBlog;