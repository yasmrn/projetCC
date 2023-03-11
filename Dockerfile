# Utiliser l'image de base node:12
FROM node:12

# Définir le répertoire de travail en tant que /app dans le conteneur
WORKDIR /app

# Copier le fichier package.json et le package-lock.json (s'il existe) dans /app
COPY package*.json ./

# Installer les dépendances Node.js définies dans package.json en utilisant npm
RUN npm install

# Copier tout le reste du code source dans /app
COPY . .

# Exposer le port 3000 pour que les connexions entrantes puissent atteindre le conteneur
EXPOSE 3000

# Définir la commande par défaut qui sera exécutée lorsque le conteneur est démarré avec "docker run"
CMD [ "npm", "start" ]
