# ACTUALIZAR DATOS DIARIOS

Este es un código para ser ejecutado que actualiza los datos diariamente desde **iexapis** a una base de datos **mysql** para el gráfico de seguimiento.

## Archivo .gitignore

Se colocan el nombre de archivos y/o carpetas que se ignoraran.

En este caso:

```
node_modules
.env
credentials.json
*.zip
package-lock.json
```

## HACER PRUEBAS LOCAL

### Instalando dependencias

Use en el terminal o consola ```cd EXPRESS``` para acceder a la carpeta EXPRESS y luego ```npm install``` para que node instale las dependencias necesarias encontradas en el ```package.json```

```BATCH
cd EXPRESS
npm install
```

### Explicación del código

#### node_modules

Contiene los modulos instalados por el comando ```npm install```, **NOTA: Estos archivos no deberían modificarse para que no ocurran problemas en el funcionamiento del programa**

#### crear archivo .env

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

#### crear credentials.json

Es un archivo que contiene la configuración de credenciales para poder conectarse a la API de Google Api.

#### package.json

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

#### package-lock.json

Es un archivo que se crea automáticamente al instalar las dependencias contiene el listado de dependencias totales necesarias que pueden necesitar nuestras dependencias puestas en el package.json. **NOTA: Este archivo no debe modificarse**

#### keys.js

En este archivo se establece un ```module.exports``` para que sea exportado a otro archivo. En este caso se exporta el objeto database junto con sus propiedades. ```process.env``` se usa para llamar a las variables de entorno configuradas en el .env

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

#### index.js

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


