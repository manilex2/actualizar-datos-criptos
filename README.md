# ACTUALIZAR DATOS DIARIOS

Este es un código para ser ejecutado que actualiza los datos diariamente desde **iexapis** a una base de datos **mysql** para el gráfico de seguimiento.

## Archivo .gitignore

Se colocan el nombre de archivos y/o carpetas que se ignoraran

## HACER PRUEBAS LOCAL

### Instalando dependencias

Use en el terminal o consola ```cd EXPRESS``` para acceder a la carpeta EXPRESS y luego ```npm install``` para que node instale las dependencias necesarias encontradas en el ```package.json```

```
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
