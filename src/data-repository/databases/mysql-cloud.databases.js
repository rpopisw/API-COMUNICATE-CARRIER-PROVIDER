const MySqlDriver = require('../drivers/mysql.db-driver');

let credentials;

class MysqlCloudDatabase {
  static getInstance() {
    if (!credentials) {
      credentials = {
          host : process.env.HOST_DATABASE,
          database: process.env.NAME_DATABASE,
          password: process.env.PASSWORD_DATABASE,
          user: process.env.USERNAME_DATABASE
      }
    }
    return new MySqlDriver({
      host: credentials.host,
      database: credentials.database,
      user: credentials.user,
      password: credentials.password,
    });
  }
}

module.exports = MysqlCloudDatabase;
