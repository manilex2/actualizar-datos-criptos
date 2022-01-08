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

## REQUISITOS

1. Tener instalado [Node y NPM](https://nodejs.org/es/).
2. Tener un usuario de [Google](https://www.google.com/)
3. Haber creado las credenciales para la API Google Spreadsheet en [Google Developers](https://developers.google.com/)
4. Haber creado una base de datos ```MySQL``` y tener los accesos a ella.
5. Tener una cuenta en [AWS](https://aws.amazon.com/)