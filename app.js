import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 3, // 3 hours
      httpOnly: true,
      secure: true,
    },
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to vaccine reminder backend development server");
});

export default app;
