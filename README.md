# SkydropX_Developer_Challenges

## Descripción del reto técnico:

Tienes una plataforma para realizar envíos a través de distintas paqueterías (aplicación ​A)​, la cual genera etiquetas que posteriormente imprime el usuario y entrega al momento de la recolección del paquete. Una etiqueta es un archivo usualmente en formato PDF que contiene el número de rastreo y la información de origen y destino del envío.

Actualmente en la aplicación A el usuario crea una nueva orden para un envío con los datos correspondientes y selecciona una paquetería. La aplicación A realiza una llamada directamente al API de la paquetería seleccionada por el usuario con los datos del envío y esta devuelve el PDF de la etiqueta que a su vez es devuelta al usuario.

Quieres abstraer la funcionalidad de la generación de las etiquetas de los envíos para no tener toda esa lógica dentro de la aplicación A y eventualmente comercializar esta funcionalidad como un nuevo servicio que pueda ser consumido por otras plataformas, por lo que decides hacer un Microservicio enfocado únicamente en generar las etiquetas.

![image](https://user-images.githubusercontent.com/69777661/160027700-5de689e0-e88a-4556-8b34-c3af019ba32b.png)

API de carrier de prueba: https://fake-carrier-api.skydropx.com/v1/labels

### Solicion propuesta 

![image](https://user-images.githubusercontent.com/69777661/160028739-f6840d2b-e16c-4751-b1a4-f662d62339c8.png)


### Endpoints disponibles 

| Resource / HTTP method | metodo       | descripcon         | 
| ---------------------- | ---------------- | ----------- |
| `https://74f1m1d6ha.execute-api.us-east-1.amazonaws.com/dev/v1/etiqueta-paquete` | POST  |Generar archivo zip y subirlo a s3 |
| `https://74f1m1d6ha.execute-api.us-east-1.amazonaws.com/dev/v1/etiqueta-paquete/{id_solicitud}/estado`  |   GET  | Consultar el estado del registro | 
| `https://74f1m1d6ha.execute-api.us-east-1.amazonaws.com/dev/v1/etiqueta-paquete/{id_solicitud}/file-zip` |    GET  | Descargar archivo almacenado en s3 |


## Instalar y ejecutar 🚀

Para iniciar el proyecto tienes que seguir lo siguientes pasos 

1.- Instalar serverless framework  
```
npm install -g serverless
```
2.- Configurar credenciales de aws

 para poder hacer la prueba se creo un usuario y tengan acceso al entorno de aws 
 las credenciales son: 
### aws_access_key_id=AKIA6KXC4TXUHMSEGHPN
### aws_secret_access_key=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

```
serverless config credentials \
  --provider aws \
  --key AKIA6KXC4TXUHMSEGHPN \
  --secret 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
```

3- Instalar las dependencias 
```
npm install
```
4.- Desplegar de forma local 
```
npm run dev
```
5.- Desplegar en la nube
```
serverless deploy
```

## Ejecutando las pruebas ⚙️

Se realizo pruebas para validar el estado de los endpoints,para ejecutar las pruebas debemos ejecutar :

```
npm run test
```

### Analice las pruebas 🔩

![image](https://user-images.githubusercontent.com/69777661/160029643-78d30bac-74b4-43ba-bec1-7bb09d034207.png)


## Herramientas serverless 🛠️

| Plugin | Stats |
|:---------------------------|:-----------:|
| **[Offline - `serverless-offline`](https://github.com/dherault/serverless-offline)** <br/> Emulate AWS λ and API Gateway locally when developing your Serverless project | ![Github Stars](https://img.shields.io/github/stars/dherault/serverless-offline.svg?label=Stars&style=for-the-badge) <br/> ![NPM Downloads](https://img.shields.io/npm/dt/serverless-offline.svg?label=Downloads&style=for-the-badge)|

## Despliegue en aws 📦

Despligue de funciones Lambda

```
sls deploy
```

Configurando adecuadamente las AWS Credentials, el comando sls deploy debería desplegar las funciones Lambda correctamente.
