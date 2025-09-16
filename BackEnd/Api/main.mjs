import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import uploads from "./Config/multer.mjs";
import initializeDatabase from './Config/server.mjs';
import { loginRoute } from './Controller/login.mjs';
import { registerRoute } from './Controller/register.mjs';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";


const router = express.Router();
const app = express();
const port = 4555;

app.use('/uploads', express.static('uploads'));
dotenv.config();

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));
app.use(express.static(path.join(__dirname, '../../FrontEnd')));

// Rotas para HTMLs
["registro","home"].forEach(pagina => {
  app.get(`/${pagina}.html`, (req, res) => {
    res.sendFile(path.join(__dirname, `../../FrontEnd/Html/${pagina}.html`));
  });
});
// Rota raiz redireciona para Main.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../FrontEnd/Html/registro.html"));
});


// Inicializar banco de dados
let db;
async function startServer() {
    db = await initializeDatabase();

    // Rotas
    app.post('/login', (req, res) => loginRoute(req, res, db));
    app.post('/register', (req, res) => registerRoute(req, res, db));

    // Iniciar servidor
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

startServer().catch(err => {
    console.error('Failed to start server:', err);
});












