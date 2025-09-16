
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Carregar variáveis de ambiente do arquivo .env no diretório src/
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

// Verificar se todas as variáveis de ambiente necessárias estão definidas
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${missingVars.join(', ')}`);
}

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

// Função para conectar ao banco e criar a tabela de usuários
async function initializeDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conexão com MySQL estabelecida com sucesso...');

        // Criar tabela se não existir
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);
        console.log('Tabela "users" inicializada...');
        
        return connection;
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
        throw error;
    }
}

export default initializeDatabase;