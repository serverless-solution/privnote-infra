import express from 'express';
import noteRoutes from './routes/noteRoutes';
import { v5JsonBodyParserFix } from './middlewares/v5JsonBodyParserFix';

const app = express();

app.use(v5JsonBodyParserFix);
// app.use(express.json());

// routes
app.use('/api/notes', noteRoutes);
app.route('/api/debug').all((req, res) => {
  res.json({
    body: req.body,
    query: req.query,
  });
});

// Export the app for serverless-http
export default app;
