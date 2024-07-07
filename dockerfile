FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Para el caso de esta imagen, require de antes
# inicializar el cliente de prisma, por eso
# definimos este comando que debe ejecutarse en
# la construccion de la imagen
RUN npx  prisma generate

EXPOSE 3001