import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
// import cookieParser from "cookie-parser";
// import session from "express-session";

import productsRouter from "./src/modules/products/route.js";
import authRouter from "./src/modules/authentication/route.js";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// // Session Configuration
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 3, // 3 hours
//       httpOnly: true,
//       secure: true,
//     },
//   })
// );

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);

export default app;
