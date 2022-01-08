# HACER PRUEBAS LOCAL

## Instalando dependencias

Use en el terminal o consola ```cd EXPRESS``` para acceder a la carpeta EXPRESS y luego ```npm install``` para que node instale las dependencias necesarias encontradas en el ```package.json```

```BATCH
cd EXPRESS
npm install
```

## Inicializar nuestra aplicación

Se ejecuta usando el comando ```npm run (nombre del script que configuramos en el package.json)```. En nuestro caso:

```BATCH
npm run dev
```

## Explicación del código

### node_modules

Contiene los modulos instalados por el comando ```npm install```, **NOTA: Estos archivos no deberían modificarse para que no ocurran problemas en el funcionamiento del programa**

### crear archivo .env

Para hacer las pruebas en LOCAL se debe crear un archivo ```.env``` que tendrá las variables de entorno para la ejecución del programa. Las variables de entorno estan formadas por el nombre de la variable (comunmente en mayúsculas) más un = más el valor de la variable (el cual se lo daremos nosotros) sin espacios y sin comillas. 

En este caso las variables de entorno son:

```
DB_DATABASE=**********
DB_HOST=**********
DB_PASSWORD=**********
DB_PORT=**********
DB_USER=**********
TOKEN_IEXAPIS=**********
SPREADSHEET_ID=**********
ID_HOJA=**********
```

### crear credentials.json

Es un archivo que contiene la configuración de credenciales para poder conectarse a la API de Google Api.

### package.json

Se crea por primera vez usando el comando ```npm init```. Contiene el titulo el nombre de la aplicación, la versión, descripción, keywords, author, licencia, los scripts, las dependencias tanto global como dependencias solo a nivel de desarrollo.

En este caso se configura de la siguiente manera:

```JSON
{
    "name": "agregar-actualizar-datos",
    "version": "1.0.0",
    "description": "",
    "keywords": [],
    "author": "Manuel Pereira",
    "license": "ISC",
    "scripts": {
        "dev": "nodemon index.js"
    },
    "dependencies": {
        "dotenv": "^10.0.0",
        "express": "^4.17.1",
        "googleapis": "^91.0.0",
        "mysql2": "^2.3.0",
        "node-fetch": "^2.6.1"
    },
    "devDependencies": {
        "nodemon": "^2.0.15",
        "morgan": "^1.10.0"
    }
}
```

### package-lock.json

Es un archivo que se crea automáticamente al instalar las dependencias contiene el listado de dependencias totales necesarias que pueden necesitar nuestras dependencias puestas en el package.json. **NOTA: Este archivo no debe modificarse**

### keys.js

En este archivo se establece un ```module.exports``` para que sea exportado a otro archivo. En este caso se exporta el objeto database junto con sus propiedades. ```process.env``` se usa para llamar a las variables de entorno configuradas en el archivo ```.env```

```JS
module.exports = {
    database: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE
    }
}
```

### index.js

Se permite con ```dotenv``` el uso de variables de entorno.

```JS
require('dotenv').config();
```

Se importa el framework ```Express.js``` que permite usar JavaScript desde el lado del servidor

```JS
const express = require('express');
```

Se importa la libreria ```morgan``` que permite ver los códigos de respuesta al consultar nuestro servidor

```JS
const morgan = require('morgan');
```

Se inicializa ```Express.js```

```JS
const app = express();
```

Se importa la libreria ```mysql``` para conectarnos a la Base de Datos MySQL

```JS
const mysql = require('mysql2');
```

Se importa la libreria ```node-fetch``` que permite hacer solicitudes HTTP a las URL y obtener sus datos.

```JS
const fetch = require('node-fetch');
```

Se configura un puerto para nuestro servidor local

```JS
const PUERTO = 4300;
```

Se importa la libreria ```googleapis``` para conectarnos a Google Api

```JS
const {google} = require('googleapis');
```

Se configura el autorizador de Google pasandole al ```keyFile``` nuestro ```credentials.json``` y el ```scopes``` en este caso será para usar Google Spreadsheets.

```JS
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
});
```

Importamos nuestro archivo ```keys.js``` que habíamos exportado

```JS
const { database } = require('./keys');
```

Creamos nuestra conexión a la base de datos, introduciendo la propiedad ```host, user, password, port, database``` exportado de nuestro archivo ```keys.js```

```JS
const conexion = mysql.createConnection({
    host: database.host,
    user: database.user,
    password: database.password,
    port: database.port,
    database: database.database
});
```

Creamos dos variables vacias de tipo ```Array``` para luego almacenar datos en ellos.

```JS
var ticker = [];
var propost = [];
```

Diciendole a nuestra app que use ```Morgan``` inicializamos ```Morgan``` y le indicamos que será en desarrollo

```JS
app.use(morgan("dev"));
```

Diciendole a nuestra app que obtenga, creamos nuestro get mediante ```'/'``` indicandole que al ir a nuestra ruta principal en el servidor haga lo que sigue, se coloca ```async``` para indicar que va a ser una función asíncrona y se colocan los dos parámetros personalizados ```solicitud``` y ```respuesta```.

```JS
app.get('/', async (solicitud, respuesta) => {
    ...
};
```

Se asigna el nombre de la hoja de cálculo (en este caso viene en una variable de entorno)

```JS
const spreadsheetId = process.env.SPREADSHEET_ID;
```

Se obtiene al cliente mediante el ```auth``` creado anteriormente y la función ```getClient()``` para autorizar al usuario a que haga cambios o lectura en Google Api, se usa ```await``` para indicarle a la función que debe primera obtener el ```client``` antes de continuar.

```JS
const client = await auth.getClient();
```

Se hace la conexión a Google Spreadsheet indicando la versión de la API y pasandole el ```auth``` almacenado en nuestra constante ```client```

```JS
const googleSheet = google.sheets({ version: 'v4', auth: client });
```

Se almacenan los datos que vienen desde la hoja de cálculo usando el ```get``` usando como propiedades el ```auth```, el id de la hoja de cálculo que guardamos en ```spreadsheetId``` y el ```range``` que se coloca entre comillas con el nombre de la Hoja dentro del spreadsheet (en este caso mandado en una variable de entorno) y el rango de celdas.

```JS
const request = (await googleSheet.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: `${process.env.ID_HOJA}!A2:L`
    })).data
```

Recorremos ```request``` mediante un ciclo ```for``` y a su vez otro para recorrer lo que hay dentro de cada iteración. Si el ciclo detecta que el valor en la posición ```[4]``` de cada iteración es diferente a indefinido, agrega a nuestras variables ```ticker``` y ```propost``` en cada iteración en su posición ```[0]``` y ```[4]``` respectivamente, valores.

```JS
for (let i = 0; i < request.values.length; i++) {
    for (let x = 0; x < request.values[i].length; x++) {
        if(request.values[i][4] != undefined) {
            ticker.push(request.values[i][0]);
            propost.push(request.values[i][4]);
        }    
    }
};
```

Se crea una variable que solo almacene tickers que sean únicos (sin repeticiones)

```JS
var tickerSinDuplicados = [...new Set(ticker)];
```

Se llama a la función ```mostrarDatos``` y se le pasa como parámetro lo almacenado en ```tickerSinDuplicados```.
En la función ```mostrarDatos``` que esta comentada con ```//``` se usó como pruebas y se mandaba como parámetros, la variable ```ticker``` y ```propost```

```JS
mostrarDatos(tickerSinDuplicados);
//mostrarDatos(ticker, propost);
```

Se crea la función asíncrona ```mostrarDatos``` y se le asigna un nombre personalizado de parámetro

```JS
async function mostrarDatos(tickerSinDuplicados) {
    ...
};
```

Se ejecuta un ```for``` para recorrer cada ticker dentro de ```tickerSinDuplicados```, se guarda el ticker individual en una variable ```tickerN```, luego se ejecuta mediante un ```await``` un ```fetch``` que va a hacer una llamada a la URL de ```iexapis``` pasandole el nombre del ticker con la variable ```tickerN``` y el ```token``` (en este caso viene en una variable de entorno). Luego con ```then``` se obtienen mediante el parámetro personalizado ```res``` lo datos y se retornan mediante ```return``` en forma de json con ```json()```. Luego mediante otro ```then``` se obtiene mediante otro parámetro personalizado la respuesta ```json``` y se guarda en la variable ```ultimoPrecio``` y luego ejecuta la función ```actualizarDatos``` pasandole como parámero la variable ```ultimoPrecio```

```JS
for (let i = 0; i < tickerSinDuplicados.length; i++) {
    var tickerN = tickerSinDuplicados[i];
    await fetch(`https://cloud.iexapis.com/stable/stock/${tickerN}/quote?token=${process.env.TOKEN_IEXAPIS}`).then((res)=>{
        return res.json();
    }).then((json)=>{
        var ultimoPrecio = json;
        actualizarDatos(ultimoPrecio);
    })
};
```

En este ```mostrarDatos``` comentado con ```/* ... */``` usado como pruebas se reciben como parámetros con nombre personalizados el ```ticker``` y ```propost```. Luego se ejecuta un ciclo ```for``` y recorre cada ticker almacenado en nuestro ```ticker``` y lo guarda en una variable llamada ```tickerN``` a su vez recorre cada precio almacenado en nuestro ```propost``` y lo guarda en la variable ```ultimoPrecio``` y luego ejecuta nuestra función actualizarDatos pasando como parámetros nuestras variables ```tickerN``` y ```ultimoPrecio```

```JS
/* async function mostrarDatos(ticker, propost) {
    for (let i = 0; i < ticker.length; i++) {
        var tickerN = ticker[i];
        var ultimoPrecio = propost[i];
        actualizarDatos(tickerN, ultimoPrecio);
    }
} */
```

Se crea la función asíncrona ```actualizarDatos``` y se le asigna un nombre personalizado de parámetro

```JS
async function actualizarDatos(ultimoPrecio) {
    ...
};
```

Se guarda una nueva fecha

```JS
const time = new Date();
```

Se guarda el mes

```JS
const month = time.getMonth() + 1;
```

Se guarda fecha actual, obteniendo el año con ```getFullYear()``` más el separador, en este caso ```'-'``` más lo que guardamos en ```month``` más otra vez el separador ```'-'``` y obtenemos el día con ```getDate()```

```JS
let fechaActual = time.getFullYear() + '-' + month + '-' + time.getDate();
```

El ```fechaActual``` comentado con ```//``` usado para pruebas, se le asigna un valor de fecha fijo

```JS
//let fechaActual = "2021-11-24";
```

Se almacena en una variable personalizada llamada ```sql``` la instrucción ```SQL``` a utilizar, en este caso un ```UPDATE```

```JS
var sql = `UPDATE datos SET propost = ${ultimoPrecio.latestPrice} WHERE ticker = '${ultimoPrecio.symbol}' AND fecha = '${fechaActual}'`;
```

Esta variable personalizada ```sql``` comentada con ```//``` utilizada para pruebas, se usa para establecer lo que venía en los datos fijos establecidos

```JS
//var sql = `UPDATE datos SET propost = ${ultimoPrecio} WHERE ticker = '${tickerN}' AND fecha = '${fechaActual}'`;
```

Hace la conexión a ```MySQL``` pasandole como parámetro la variable ```sql``` almacenada y nos dirá si hubo un error, que ocurrió.

```JS
conexion.query(sql, function (err) {
    if (err) throw err;
});
```

Indicamos un mensaje por consola.

```JS
console.log(`Se estableció el precio ${ultimoPrecio} del ${fechaActual} de ${tickerN}`);
```

Diciendole a nuestra app que escuche, creamos nuestro listen indicandole el puerto a escuchar de dos formas usando nuestra variable ```PUERTO``` o con nuestra variable de entorno ```PORT``` y se le pasa una función ```()=>``` para haga lo que sigue, que es arrojar por consola el siguiente mensaje:

```JS
app.listen(process.env.PORT || PUERTO, () => {
    console.log(`Escuchando y ejecutando en el puerto: ${process.env.PORT || PUERTO}`);
})
```