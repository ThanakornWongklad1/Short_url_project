import express from 'express';
import cors from 'cors';
import './config/dotenv.js';
import data from './routes/data.js';


const PORT = process.env.PORT || 5050;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/', data)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});