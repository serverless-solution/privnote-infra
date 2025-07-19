import express from 'express';
import noteRoutes from './routes/noteRoutes';

const app = express();

app.use(express.json());

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
