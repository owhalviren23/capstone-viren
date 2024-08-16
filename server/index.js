require("dotenv").config();
const express = require("express");
const { postgraphile } = require("postgraphile");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const cors = require("cors");

const app = express();

app.use(cors());
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(
  postgraphile(pgPool, "public", {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    pgDefaultRole: "anonymous",
    jwtSecret: process.env.JWT_SECRET,
    jwtPgTypeIdentifier: "public.jwt_token",
    showErrorStack: true,
    retryOnInitFail: true,
    /// Adjust this as per your JWT setup in PostgreSQL
  })
);

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT}/graphql`
  );
});
