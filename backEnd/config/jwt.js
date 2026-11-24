// A mesma chave é usada na emissão e na validação dos tokens.
const secret = process.env.JWT_SECRET
if (!secret || secret.length < 32) {
    throw new Error('Configure JWT_SECRET com pelo menos 32 caracteres antes de iniciar.')
}
module.exports = secret
