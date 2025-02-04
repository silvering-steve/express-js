import mongoose from 'mongoose';
import app from './app';
import 'dotenv/config';

app.listen(process.env.APP_PORT, async () => {
  await mongoose.connect(process.env.DATABASE_URI);

  console.log(`Listening on port ${process.env.APP_PORT}`);
});
