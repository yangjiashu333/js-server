import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from './config/logger';
import upload from './middleware/upload';
import redisClient from './config/redis';
import routes from './routes';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.locals.redis = redisClient;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.post(
  '/upload',
  upload.single('file'),
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
    }
    res.send(`File uploaded successfully: ${req.file.originalname}`);
  },
);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
