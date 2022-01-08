require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const mysql = require('mysql2');
const fetch = require('node-fetch');
const PUERTO = 4300;
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
var propost = [];

app.use(morgan("dev"));
    
app.get('/', async (solicitud, respuesta) => {
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
            if(request.values[i][4] != undefined) {
                ticker.push(request.values[i][0]);
                propost.push(request.values[i][4]);
            }
            
        }
    }

    var tickerSinDuplicados = [...new Set(ticker)];

    mostrarDatos(tickerSinDuplicados);
    //mostrarDatos(ticker, propost);

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

    /* async function mostrarDatos(ticker, propost) {
        for (let i = 0; i < ticker.length; i++) {
            var tickerN = ticker[i];
            var ultimoPrecio = propost[i];
            actualizarDatos(tickerN, ultimoPrecio);
        }
    } */

    async function actualizarDatos(tickerN, ultimoPrecio) {
        const time = new Date();
        const month = time.getMonth() + 1;
        let fechaActual = time.getFullYear() + '-' + month + '-' + time.getDate();
        //let fechaActual = "2021-11-24";
        var sql = `UPDATE datos SET propost = ${ultimoPrecio.latestPrice} WHERE ticker = '${ultimoPrecio.symbol}' AND fecha = '${fechaActual}'`;
        //var sql = `UPDATE datos SET propost = ${ultimoPrecio} WHERE ticker = '${tickerN}' AND fecha = '${fechaActual}'`;
        conexion.query(sql, function (err) {
            if (err) throw err;
        });
        console.log(`Se estableció el precio ${ultimoPrecio} del ${fechaActual} de ${tickerN}`);
    }
});

app.listen(PUERTO || process.env.PORT, () => {
    console.log(`Escuchando y ejecutando en el puerto: ${PUERTO || process.env.PORT}`);
})