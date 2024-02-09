const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'db', // Utilisez le nom du service défini dans docker-compose.yml
  user: 'root',
  password: 'password',
  database: 'matcha',
  port: 3306, // Port défini dans docker-compose.yml
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL :', err.stack);
    return;
  }
  console.log('Connecté à la base de données MySQL en tant que ID', connection.threadId);
});

module.exports = connection;
