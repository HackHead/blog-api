const { v4: uuidv4 } = require('uuid');
const { hash, genSalt } = require('bcrypt');


function slugify(str) {
    return str
        .toLowerCase()                      // Convert to lowercase
        .replace(/\s+/g, '-')               // Replace spaces with hyphens
        .replace(/[^\w-]+/g, '')            // Remove non-word characters (except hyphens)
        .replace(/--+/g, '-')               // Replace multiple consecutive hyphens with a single hyphen
        .replace(/^-+|-+$/g, '');           // Remove leading and trailing hyphens
}

const languages = [
    { id: '5072ccb6-520c-443f-bced-2a9732f227f1', "code": "en", "name": "English" },
    { id: 'c595019d-e4c5-42cc-b604-b775523fd07a', "code": "ru", "name": "Russian" },
    { id: '8e15ccb5-25f3-474d-990e-734c27b52e9a', "code": "es", "name": "Spanish" },
    { id: '5bb6327a-e33e-4d06-a481-13ac8f5cfb18', "code": "ar", "name": "Arabic" },
    { id: 'e163b850-6bd5-44d8-89ad-4e446459f300', "code": "pl", "name": "Polish" },
];

const users = [
    {
        id: '6e9484a0-7d70-4586-af24-69fef2b04d16',
        email: 'user1@example.com',
        password: 'password1',
        first_name: 'John',
        last_name: 'Doe',
        full_name: 'John Doe'
    },
    {
        id: '3575f838-99a0-4669-b5c4-2fd0b6a98f42',
        email: 'user2@example.com',
        password: 'password2',
        first_name: 'Jane',
        last_name: 'Smith',
        full_name: 'Jane Smith'
    },
    {
        id: '79a53e12-de62-4dbd-804b-39c447c13096',
        email: '2c83c8a0-17dd-4bf6-ac38-f29257cfa059',
        password: 'password3',
        first_name: 'Michael',
        last_name: 'Johnson',
        full_name: 'Michael Johnson'
    }
]

const categories = [
    {
        id: '2999be60-53dd-4050-8dd8-646cc0da1247',
        name: 'Electronics'
    },
    {
        id: 'd9d11bc1-8126-4177-a325-00aeae150f27',
        name: 'Clothing'
    },
    {
        id: 'af4b7d03-480c-49c9-ba24-ae7a9164dc12',
        name: 'Books'
    }
];

const articles = [
    {
        id: '193a62d3-ead6-49ca-b0c1-5805548ed6aa',
        thumbnail: 'https://picsum.photos/500/800',
        name: 'The Art of Storytelling',
        authorId: users[0].id,
        categoryId: categories[0].id,
    },
    {
        id: 'ed907a33-e862-4015-807e-d707ddd99b3c',
        thumbnail: 'https://picsum.photos/500/800',
        name: 'Exploring the Depths of the Ocean',
        authorId: users[1].id,
        categoryId: categories[0].id,
    },
    {
        id: 'fcca9a77-02dc-4f2b-93ff-62925baea638',
        thumbnail: 'https://picsum.photos/500/800',
        name: 'The Rise of Artificial Intelligence',
        authorId: users[2].id,
        categoryId: categories[0].id,
    },
    {
        id: 'aff971b5-e21d-4674-8c92-b946df8d51a8',
        thumbnail: 'https://picsum.photos/500/800',
        name: 'Unveiling the Secrets of Ancient Civilizations',
        authorId: users[0].id,
        categoryId: categories[1].id,
    },
    {
        id: '4bd61074-5983-4609-a374-53695c3d2750',
        thumbnail: 'https://picsum.photos/500/800',
        name: 'The Power of Positive Thinking',
        authorId: users[1].id,
        categoryId: categories[1].id,
    },
    {
        id: 'ccaa7ec9-4a92-4ef5-9157-a7884beaac4a',
        thumbnail: 'https://picsum.photos/500/800',
        name: 'Journey Through the Amazon Rainforest',
        authorId: users[2].id,
        categoryId: categories[1].id,
    },
    {
        id: 'b8314616-be18-4a37-bbe0-a8f5a40c5e01',
        thumbnail: 'https://picsum.photos/500/800',
        name: 'The Importance of Healthy Habits',
        authorId: users[0].id,
        categoryId: categories[2].id,
    },
    {
        id: 'cd61b51d-4f77-4157-8ee6-7a4030d1540f',
        thumbnail: 'https://picsum.photos/500/800',
        name: 'Mastering the Art of Public Speaking',
        authorId: users[1].id,
        categoryId: categories[2].id,
    },
    {
        id: '7181aad8-c354-452b-a770-626d4e503f31',
        thumbnail: 'https://picsum.photos/500/800',
        name: 'Unlocking the Secrets of Time Management',
        authorId: users[2].id,
        categoryId: categories[2].id,
    }
];
const genCategoryTranslation = () => {
    const res = []
    for (const lang of languages) {
        for (const category of categories) {
            res.push({
                id: uuidv4(),
                name: `${category.name}_${lang.code}`,
                languageId: lang.id,
                categoryId: category.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
        }
    }

    return res;
}

const generateArticleTranslation = () => {
    const res = []
    for (const lang of languages) {
        for (const article of articles) {
            res.push({
                id: uuidv4(),
                title: `${article.name}_${lang.name}`,
                body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec facilisis ac dui sed commodo. Nulla aliquet sapien id turpis vestibulum aliquam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas consequat non risus sed pretium. Nullam rutrum quis quam eu hendrerit. In hac habitasse platea dictumst. Quisque rutrum metus at porta dignissim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae`,
                excerpt: `Lorem ipsum dolor sit amet, consectetur adipiscing elit`,
                slug: slugify(`${article.name}_${lang.name}`),
                articleId: article.id,
                languageId: lang.id,
                pub_date: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            })
        }
    }

    return res;
}

module.exports = {
    users: users.map(async (user) => {
        const salt = await genSalt(10);

        user.password = await hash(user.password, salt);
        user.createdAt = new Date();
        user.updatedAt = new Date();

        return user;
    }),
    categories: categories.map((category) => {
        category.createdAt = new Date();
        category.updatedAt = new Date();

        return category;
    }),
    languages: languages.map((lang) => {
        lang.createdAt = new Date();
        lang.updatedAt = new Date();

        return lang;
    }),
    articles: articles.map((article) => {

        article.createdAt = new Date();
        article.updatedAt = new Date();
        
        return article;
    }),
    articleTranslations: generateArticleTranslation(),
    categoryTranslations: genCategoryTranslation()
}