const express = require('express'); //Importe framework Express pour Node.js
const MongoClient = require('mongodb').MongoClient; //Importe client MongoDB pour node.js
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/mydb'; //Recupere l'URL de la bdd MongoDB à partir des variables d'environnement si elle existe sinon utilisation URL locale
const app = express(); //creation d'une nouvelle instance de l'application Express

const port = 3000; //Port sur lequel l'application va écouter les requêtes

// Utilise le middleware de lecture des données du formulaire
app.use(express.urlencoded({ extended: true }));

//Modules fs et path importés pour gérer les fichiers
const fs = require('fs');
const path = require('path');

//Définition du chemin absolu du fichier 'file.txt' à partir du répertoire en cours (__dirname)
const filePath = path.join(__dirname, 'file.txt');


// Afficher la liste des annonces

//Definition route GET pour page d'accueil
app.get('/', async (req, res) => {
    //Etablit connexion à la bdd MongoDB
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true });
    const db = client.db(); //selectionne la bdd
    const collectionExists = await db.listCollections({ name: 'courses' }).hasNext();
  
    if (!collectionExists) {
      // Crée la collection 'courses' si elle n'existe pas déjà
      await db.createCollection('courses');
  
      // Ajoute quelques annonces de cours pour tester
      await db.collection('courses').insertMany([
        { title: 'Mathématiques', price: 25 },
        { title: 'Physique', price: 30 },
        { title: 'Chimie', price: 20 },
      ]);
    }
  const courses = await db.collection('courses').find().toArray(); //recupere toutes les annonces de cours stockées dans collection 'courses' et les stocke dans un tableau
  //lit le contenu du fichier 'file.txt'
  fs.readFile('file.txt', 'utf8', function(err, data) {
        if (err) {
        throw err;
        }
        
    const html = `
        <html>
        <head>
            <title>Support Courses Ads</title>
            <style>
                
                .container {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-evenly;
                    align-items: center;
                    margin: 10px;
                    color: white;

                }
                
            
                .card {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background-color: #f5f5f5;
                    padding: 20px;
                    margin: 20px;
                    width: 300px;
                    height: 300px;
                    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease-in-out;
                }
                
                .card:hover {
                    transform: scale(1.1);
                }
                
                form {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    margin: 20px;
                    padding: 20px;
                    color: white;
                    background-color: #0e0e0e;
                    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
                }
                
                form input[type="text"],
                form input[type="number"],
                form input[type="submit"] {
                    margin: 5px;
                    padding: 5px;
                    border-radius: 20px;
                    border: none;
                    font-size: 10px;
                }
                
                form input[type="submit"] {
                    background-color: #1f3d6a;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease-in-out;
                }
                
                form input[type="submit"]:hover {
                    background-color: #08064b;
                }
                
                h1 {
                    text-align: center;
                    margin: 20px;
                    margin-bottom: 15px;
                    font-size: 25px;
                }
                
                h2 {
                    margin: 20px;
                    font-size: medium;
                    text-align: center;
                    font-family: Georgia, 'Times New Roman', Times, serif;
                }
                
                ul {
                    list-style: none;
                    padding: 0;
                    margin: 20px;
                    color: white;
                    text-align: center;
                }
                body{
                    background-color: rgba(201, 201, 201, 0.721);
                }
                
                li {
                    border-radius: 20px;
                    font-size: 10px;
                    margin: 10px;
                    padding: 10px;
                    background-color: #0e0d0d;
                    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
                }
            </style>
        </head>
        <body>
            <h1> Bienvenue sur notre plateforme d'annonces de cours de soutien !  </h1>
            <h2>Ajouter une annonce </h2>
            <p>${data}</p><form method="post" action="/add">
                <label for="title">Titre:</label>
                <input type="text" id="title" name="title"><br><br>
                <label for="price">Prix:</label>
                <input type="number" id="price" name="price"><br><br>
                <input type="submit" value="Ajouter">
            </form>
            <h2> Voici des cours qui pourraient vous intéresser :</h2>
            <ul>
                ${courses.map(course => `<li>${course.title} - ${course.price}$</li>`).join('')}
            </ul>
        </body>
        </html>
    `;
    res.send(html); //envoie réponse html au client
  });
  client.close(); //ferme la connexion à la bdd
}); //termine la définition de la route

// Ajouter une annonce dans la base de données

//definition route POST pour ajout d'une annonce ('/add')
app.post('/add', async (req, res) => {
  const { title, price } = req.body; //recupere données envoyées par le form POST
  const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true }); //connexion à la bdd MongoDB
  const db = client.db(); //selection de la bdd
  await db.collection('courses').insertOne({ title, price }); //insere une new annonce de cours dans collection 'courses'
  client.close(); //ferme connexion à la bdd
  res.redirect('/'); //redirection vers page d'accueil
});

app.listen(port, () => console.log(`App listening on port ${port}!`)); //demarrage du serveur web sur le port 3000, msg affiché lorsque serveur démarré à l'aide de 'console.log()'