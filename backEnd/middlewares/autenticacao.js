const jwt = require('jsonwebtoken')

const JWT_SECRET = 'chave_secreta_el_lobo'

const validarTokenAdmin = function(request, response, next){

    const authHeader = request.headers.authorization

    if(!authHeader){
        return response.status(401).json({
            status: false,
            message: 'Token não enviado.'
        })
    }

    const token = authHeader.replace('Bearer ', '')

    try{

        const dadosToken = jwt.verify(token, JWT_SECRET)

        if(dadosToken.tipo !== 'admin'){
            return response.status(403).json({
                status: false,
                message: 'Acesso permitido apenas para colaboradores.'
            })
        }

        request.usuario = dadosToken

        next()

    }catch(error){

        return response.status(401).json({
            status: false,
            message: 'Token inválido ou expirado.'
        })

    }

}

module.exports = {
    validarTokenAdmin
}