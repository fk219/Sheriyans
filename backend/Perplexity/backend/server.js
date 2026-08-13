import 'dotenv/config';

import { app } from './src/app.js';
import { connectDB } from './src/config/database.js';
import {llmresponse} from './src/services/ai.services.js'

const port = process.env.PORT || 3000;

llmresponse()
connectDB();
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});