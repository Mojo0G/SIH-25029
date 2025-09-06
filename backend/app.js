import express from 'express';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

export {app};