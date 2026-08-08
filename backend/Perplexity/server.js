import 'dotenv/config';

import { app } from './src/app.js';
import { connectDB } from './src/config/database.js';

const port = process.env.PORT || 3000;

connectDB();
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});