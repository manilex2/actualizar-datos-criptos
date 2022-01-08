require('dotenv').config();
const mysql = require('mysql2');
const fetch = require('node-fetch');
const {google} = require('googleapis');
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
});
const { database } = require('./keys');
const conexion = mysql.createConnection({
    host: database.host,
    user: database.user,
    password: database.password,
    port: database.port,
    database: database.database
});
var ticker = [];

exports.handler = async function (event) {
    const promise = new Promise(async function() {
        const spreadsheetId = process.env.SPREADSHEET_ID;
        const client = await auth.getClient();
        const googleSheet = google.sheets({ version: 'v4', auth: client });
        const request = (await googleSheet.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: `${process.env.ID_HOJA}!A2:L`
        })).data
        for (let i = 0; i < request.values.length; i++) {
            for (let x = 0; x < request.values[i].length; x++) {
                ticker.push(request.values[i][0]);
            }
        }
    
        var tickerSinDuplicados = [...new Set(ticker)];
    
        mostrarDatos(tickerSinDuplicados);
    });

    async function mostrarDatos(tickerSinDuplicados) {
            for (let i = 0; i < tickerSinDuplicados.length; i++) {
                var tickerN = tickerSinDuplicados[i];
                await fetch(`https://cloud.iexapis.com/stable/stock/${tickerN}/quote?token=${process.env.TOKEN_IEXAPIS}`).then((res)=>{
                    return res.json();
                }).then((json)=>{
                    var ultimoPrecio = json;
                    actualizarDatos(ultimoPrecio);
                })
            }
    }
    async function actualizarDatos(ultimoPrecio) {
            const time = new Date();
            const month = time.getMonth() + 1;
            let fechaActual = time.getFullYear() + '-' + month + '-' + time.getDate();
            var sql = `UPDATE datos SET propost = ${ultimoPrecio.latestPrice} WHERE ticker = '${ultimoPrecio.symbol}' AND fecha = '${fechaActual}'`;
            conexion.query(sql, function (err) {
                if (err) throw err;
            });
            console.log(`Se actualizo el precio actual de ${ultimoPrecio.symbol}`);
    }

    //conexion.destroy();
    return promise;
};