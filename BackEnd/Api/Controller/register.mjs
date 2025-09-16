import bcrypt from 'bcrypt';

export async function registerRoute(req, res, db) {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.json({ success: false, message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute(
            'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
            [name, email, phone, hashedPassword]
        );

        res.json({ success: true });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.json({ success: false, message: 'Email ou telefone já cadastrado.' });
        }
        console.error(err);
        res.json({ success: false, message: 'Erro ao cadastrar.' });
    }
}