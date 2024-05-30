## Description

La api toma informacion (de peliculas unicamente) de https://swapi.dev/ y las utiliza para popular su base de datos.
Lo hace de dos maneras:

- Al iniciarse la aplicacion, usando el hook onModuleInit
- Con una tarea programada que se ejecuta una vez por semana (configurable desde el env)

Lo plantee como opcion, otra forma interesante podria ser exponer un endpoint y activar la sincronizacion desde fuera de la app.

Aqui hay un diagrama a grandes razgos de la aplicacion:
![Diagram](./docs/diagrams/sw-diagram.drawio.svg)

## Requisitos

- node 18
- postgres 13 (hay un docker-compose en el proyecto que se puede usar)
- variables de entorno (dejo un .env.example con los valores)

## Instalación

instalar dependencias

```bash
$ yarn install
```

generar tablas

```bash
$ yarn run migrations:run
```

deje una migracion que inserta algunos valores para usar, se pueden loguear con admin@admin.com y regular@regular.com, contraseña: "root" para ambos

## Correr App

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Propuesta de prueba

Con la aplicacion corriendo, debe loguearse con alguno de los usuarios ("admin@admin.com", "regular@regular.com", contraseña: "root") enviando una solicitud post al endpoint:

- **/api/auth/login**

para luego hacer solicitudes a la api configurando el token jwt en las proximas consultas.

Los endpoints disponibles los pueden ver en swagger:

- **/api/docs**
