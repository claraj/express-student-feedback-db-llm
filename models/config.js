module.exports = {
    "development": {
      "storage": "feedback.sqlite",
      "dialect": "sqlite"
    },
    "production": {
      "username": process.env.DB_USERNAME,
      "database": process.env.DB_NAME,
      "host": process.env.DB_HOST,
      "password": process.env.DB_PASSWORD,
      "dialect": "postgres",
      "dialectOptions": {
        "ssl": {
          "require": true, 
          "rejectUnauthorized": false 
        }
      }
    },
    "test" : {
        "storage": "test_feedback.sqlite",
        "dialect": "sqlite"
    }
  }