import bcrypt from 'bcrypt';

export async function loginRoute(req, res, db) {
    const { contact, password } = req.body;

    if (!contact || !password) {
        return res.json({ success: false, message: 'Contato e senha são obrigatórios.' });
    }

    try {
        const [results] = await db.execute(
            'SELECT * FROM users WHERE email = ? OR phone = ?',
            [contact, contact]
        );

        if (results.length === 0) {
            return res.json({ success: false, message: 'Usuário não encontrado.' });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.json({ success: false, message: 'Senha incorreta.' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Erro ao processar login.' });
    }
}