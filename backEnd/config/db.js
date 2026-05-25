const mysql = require('mysql2')

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'bcd127',
    password: 'root',
    database: 'db_barbearia'
})

conexao.connect((error) => {

    if(error){
        console.log(error)
    }else{
        console.log('Banco conectado com sucesso')
    }

})

module.exports = conexao