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
import userRouter from "./src/modules/user/route.js";
import childRouter from "./src/modules/child/route.js";
import cartsRouter from "./src/modules/carts/route.js";
import paymentRouter from "./src/modules/payment/route.js";
import providerRoute from "./src/modules/providers/route.js";
import vaccinesRouter from "./src/modules/vaccines/route.js";
import vaccineRequestsRouter from "./src/modules/vaccines-requests/route.js";
import nurseRouter from "./src/modules/nurse/route.js";
import complaintsRouter from "./src/modules/complaints/route.js";
import productsReviewsRouter from "./src/modules/products-reviews/route.js";
import tipsRouter from "./src/modules/tips/route.js";



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
app.use("/api/user", userRouter);
app.use("/api/child", childRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/provider", providerRoute);
app.use("/api/vaccines", vaccinesRouter);
app.use("/api/vaccine-requests", vaccineRequestsRouter);
app.use("/api/nurse", nurseRouter);
app.use("/api/complaints", complaintsRouter);
app.use("/api/products-reviews", productsReviewsRouter);
app.use("/api/tips", tipsRouter);


export default app;
