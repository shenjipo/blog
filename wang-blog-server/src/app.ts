// src/app.ts
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import express from 'express';
import init from './express';
import InitLoginApi from './api/Login';
import InitBlogApi from './api/Blog';
import InitAccountApi from './api/Account';
import InitFileApi from './api/File';
const app = express();
const PORT = process.env.PORT || 3000;



init(app)
// api
InitLoginApi(app)
InitBlogApi(app)
InitAccountApi(app)
InitFileApi(app)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
