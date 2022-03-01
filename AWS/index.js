require('dotenv').config();
const mysql = require('mysql2');
const fetch = require('node-fetch');
const {google} = require('googleapis');
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
});
const { database } = require('./keys');

exports.handler = async function (event) {
    const promise = new Promise(async function() {
        const conexion = mysql.createConnection({
            host: database.host,
            user: database.user,
            password: database.password,
            port: database.port,
            database: database.database
        });
        var cripto = [];
        var propost = [];
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
                    cripto.push(request.values[i][0]);
                    propost.push(request.values[i][4]);
                }
            }
        }
    
        var criptoSinDuplicados = [...new Set(cripto)];
        var criptoTransformados = criptoSinDuplicados.join(',');
    
        mostrarDatos(criptoTransformados);
        //mostrarDatos(cripto, propost);
    
        async function mostrarDatos(criptoTransformados) {
            await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${criptoTransformados}&vs_currencies=usd`).then((res)=>{
                return res.json();
            }).then((json)=>{
                var ultimoPrecio = json;
                actualizarDatos(ultimoPrecio);
            })
        }
    
        /* async function mostrarDatos(cripto, propost) {
            for (let i = 0; i < cripto.length; i++) {
                var criptoN = cripto[i];
                var ultimoPrecio = propost[i];
                actualizarDatos(criptoN, ultimoPrecio);
            }
        } */
    
        async function actualizarDatos(ultimoPrecio) {
            const time = new Date();
            const month = time.getMonth() + 1;
            let fechaActual = time.getFullYear() + '-' + month + '-' + time.getDate();
            let criptoNew = [];
            for (const cripto in ultimoPrecio) {
                for (const precio in ultimoPrecio[cripto]) {
                    criptoNew.push([cripto, ultimoPrecio[cripto][precio]]);
                }
            }
            //let fechaActual = "2021-11-24";
            for (let i = 0; i < criptoNew.length; i++) {
                let sql = `UPDATE datos SET propost = ${criptoNew[i][1]} WHERE cripto = '${criptoNew[i][0]}' AND fecha = '${fechaActual}'`;
                //var sql = `UPDATE datos SET propost = ${ultimoPrecio} WHERE cripto = '${criptoN}' AND fecha = '${fechaActual}'`;
                conexion.query(sql, function (err) {
                    if (err) throw err;
                });
                console.log(`Se estableció el precio ${criptoNew[i][1]} del ${fechaActual} de ${criptoNew[i][0]}`);
            }
            await finalizarEjecucion();
        }
        async function finalizarEjecucion() {
            conexion.end();
            respuesta.send("Ejecutado");
        }
    });
    return promise;
};