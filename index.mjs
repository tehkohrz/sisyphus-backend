import cookieParser from 'cookie-parser';
import express from 'express';
import methodOverride from 'method-override';
import cors from 'cors';

import bindRoutes from './routes';

// Initialise Express instance
const app = express();
// Set the Express view engine to expect EJS templates
// Bind cookie parser middleware to parse cookies in requests
app.use(cookieParser());
// Bind Express middleware to parse request bodies for POST requests
app.use(
  express.urlencoded({
    extended: false,
  }),
);
// Bind Express middleware to parse JSON request bodies
app.use(express.json());
// Bind method override middleware to parse PUT and DELETE requests sent as POST requests
app.use(methodOverride('_method'));

// Prevent CORS error for development
app.use(cors());
// Bind route definitions to the Express application
bindRoutes(app);

// Set Express to listen on the given port
const PORT = process.env.PORT || 3004;
app.listen(PORT);
