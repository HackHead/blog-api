# Инструкция

#### Шаг 1: Установка необходимых компонентов
Перед началом установки убедитесь, что у вас установлены следующие компоненты:

1. Node.js v18.16.0
2. Npm (пакетный менеджер) 9.5.1
3. Yarn (npm install -g yarn - для установки)
4. PostgreSQL сервер
5. Nginx (веб-сервер)
6. Утилита pm2 для безперебойной работы вашего nodeJs приложения

#### Шаг 2: База данных
1. Установите postgresql сервер
2. Создайте пустую базу данных с произвольным названием, которую ваше Node.js приложение будет использовать.

#### Шаг 2: Настройка server/ (nodeJs прилиложение)
В файле `server/.env.local` заменити значения следующих переменных

```
JWT_SECRET=
POSTGRES_USER=   
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DATABASE_NAME=
APP_HOST=
APP_PORT=
```

- JWT_SECRET - секретный пароль который будет использоваться вашим приложением для дешифровки json-web токенов получаемых от пользователя
- POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT - логин, пароль, хост и порт сервера базы данных соотвественно.
- APP_HOST - доменное имя либо ip адрес по которому расположен ваш хостинг
- APP_PORT - порт на котором будет работать ndeJs приложение

В файле `server/src/config/config.json` замените username, password, database и host на те же значения которые указали в `server/.env.local`. Это конфигурационный файл для утилиты sequelize-cli. Она используется для того чтобы создавать миграции и сидеры, то есть чтобы нам не приходилось вручную создавать таблицы в базе данных. Утилита должна установиться сама при выполнении команда `yarn install` ниже.

Находясь в директории `server/` выполните следующие команды:
1. `yarn install` - установит установит все необходимые зависимости для приложения
2. `yarn migrate` - эта команда выполнит миграции и создаст в базе данных необходимые таблицы
3. `yarn seed` - это необязательная команда она заполнит базу тестовыми данными (несколько пользователей, категорий, статтей и переводом к ним
4. `yarn build` - по скольку в разработке я использовал typescript, который nodejs по умолчанию не понимает, нам нужно скомпилировать файлы из .js -> .ts после выполнения этой команды, в папке `server/` должна появиться поддиректория `dist/`
5. `yarn prod` - с помощью утилиты pm2 запускаем наше приложение которое будет вечно крутиться у нас на сервере, [инструкция по использованию pm2](https://pm2.keymetrics.io/docs/usage/quick-start/)

Теперь ваше приложение должно работать на указанном вами порту, используйте `pm2 logs` что посмотреть логи. (там должно быть два сообщение что приложение успешно запущено и что оно подключено к базе данных)

#### Шаг 3: Настройка админки (react приложение)
Перейдите в директорию adm2/ и выполните команду 
`npm install` - эта команда установит все необходимые зависимости для реакт приложения
В файле `adm2/src/http/index.js` замените значение константы API_URL на свое, например
`
const API_URL = 'http://example.com/api/v1'
`
Скомпилируйте приложение с помощью команды `npm run build` находясь при этом в директории `adm2/`. После этого у вас должна появиться папка `adm2/build/` в ней находятся все файлы необходимые нам для работы реакт приложения. Как такового веб-демона в реакт приложении у вас нету, это всего лишь набор статических файлов которые мы будем пересылать клиенту с помощью nginx

#### Шаг 3: nginx
Ваш nginx должен выглядить приблизительно следующим образом 
```
server {
    listen 80;
    server_name example.com; // Замените на свой домен или IP-адрес
   // Мы будем использовать nginx для проксирования запросов к nodeJs приложению если запрос
   // начинается с /api
    location /api {
        proxy_pass http://localhost:9999; // Замените на порт вашего приложения Node.js
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
   // 
    location / {
        root /path/to/your/react/app; // Замените на путь к вашему приложению React build/
        try_files $uri /index.html;
    }
}
```

На digital-ocean есть весьма неплохи туториалы
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04
https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04
https://www.digitalocean.com/community/tutorials/how-to-deploy-a-react-application-with-nginx-on-ubuntu-20-04

    