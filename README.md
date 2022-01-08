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

