const MySqlDb = require('mysql');

const ExceptionConstant = require('../exceptions/exception.constant');
const DataRepositoryException = require('../exceptions/data-repository.exception');

const Mapper = require('./mapper.db-helper');

class MySqlDriver {
  constructor({
    host, database, user, password, port = 3306,
  }) {
    this._host = host;
    this._database = database;
    this._user = user;
    this._password = password;
    this._port = port;
    this._isConnected = false;
  }

  async _createConnection() {
    const connectionPromise = new Promise((resolve, reject) => {
      const connection = MySqlDb.createConnection({
        host: this._host,
        user: this._user,
        password: this._password,
        database: this._database,
      });
      connection.connect((error) => {
        if (error) {
          return reject(new DataRepositoryException(
            ExceptionConstant.DATABASE_EXCEPTION.code,
            ExceptionConstant.DATABASE_EXCEPTION.message,
          ));
        }
        return resolve(connection);
      });
    });
    const connection = await connectionPromise;
    return connection;
  }

  async getConnection() {
    if (this._isConnected) {
      new DataRepositoryException(
        ExceptionConstant.DATABASE_CONNECTION_IN_USE_EXCEPTION.code,
        ExceptionConstant.DATABASE_CONNECTION_IN_USE_EXCEPTION.message,
      ).throw();
    }
    this._connection = await this._createConnection();
    this._isConnected = true;
    return this._connection;
  }

  async _bindQueryParams(connection, sql, values) {
    try {
      let bindSql = `${sql}`;
      Object.keys(values).forEach((tp) => {
        const value = connection.escape(values[tp]);
        bindSql = bindSql.replace(new RegExp(`(:${tp})\\b`, 'g'), value);
      });
      console.log(bindSql)
      return bindSql;
    } catch (error) {
      new DataRepositoryException(
        ExceptionConstant.DATABASE_EXCEPTION.code,
        ExceptionConstant.DATABASE_EXCEPTION.message,
      ).throw();
    }
  }

  async closeConnection(connection) {
    try {
      let connectionAux = connection;
      if (!connectionAux && this._isConnected) {
        connectionAux = this._connection;
      } else if (!this._isConnected) {
        return;
      }
      if (connectionAux.state === 'disconnected') {
        return;
      }
      connectionAux.destroy();
    } catch (error) {
      new DataRepositoryException(
        ExceptionConstant.DATABASE_EXCEPTION.code,
        ExceptionConstant.DATABASE_EXCEPTION.message,
      ).throw();
    } finally {
      this._isConnected = false;
      this._connection = undefined;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async commit(connection) {
    let connectionAux = connection;
    if (!connectionAux) {
      connectionAux = this._connection;
    } else if (!this._isConnected) {
      return;
    }
    const commitPromise = new Promise((resolve, reject) => {
      connection.commit((error) => {
        if (error) {
          this._isConnected = false;
          this._connection = undefined;
          return reject(new DataRepositoryException(
            ExceptionConstant.DATABASE_EXCEPTION.code,
            ExceptionConstant.DATABASE_EXCEPTION.message,
          ));
        }
        this._isConnected = false;
        resolve();
      });
    });
    await commitPromise;
  }

  async _execute({
    connection, statement, values, options = {},
  }) {
    const queryPromise = new Promise((resolve, reject) => {
      const { timeout } = options;
      connection.query({ sql: statement, values, timeout: ((timeout || 15) * 1000) }, (error, data) => {
        if (error) {
          if (error.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
            return reject(new DataRepositoryException(
              ExceptionConstant.DATABASE_TIMEOUT_EXCEPTION.code,
              ExceptionConstant.DATABASE_TIMEOUT_EXCEPTION.message,
            ));
          }
          return reject(new DataRepositoryException(
            ExceptionConstant.DATABASE_EXCEPTION.code,
            ExceptionConstant.DATABASE_EXCEPTION.message,
          ));
        }
          return resolve(data);
      });
    });
    const result = await queryPromise;
    return result;
  }

  /**
   * Execute query statement.
   *
   * @param {object} scheme - Scheme.
   * @param {string} scheme.connection - Database Connection.
   * @param {string} scheme.statement - SQL Statement.
   * @param {(object | string[])} [scheme.values] - The query values.
   * @param {object} [scheme.target] - The object where the query result is linked.
   * @param {object[]} [scheme.manualMapping] - List of properties to mapping manually the query result.
   * @param {string} [scheme.manualMapping.source] - Source property
   * @param {string} [scheme.manualMapping.target] - Target property
   * @param {object} [scheme.options={ timeout: 15 }] - Option.
   * @param {object | Callback} [throwException] - Throw Exception if something fail .
   * @returns {object | object[]} Query result.
   */
  async executeQuery({
    connection,
    statement,
    values = {},
    target,
    manualMapping,
    options,
  }, throwException) {
    let connectionAux;
    try {
      connectionAux = connection || await this.getConnection();
      const query = await this._bindQueryParams(connectionAux, statement, values);
      const queryResult = await this._execute({
        connection: connectionAux, statement: query, options,
      });

      if (Array.isArray(queryResult)) {
        const data = queryResult.map((row) => {
          if (manualMapping) {
            Object.entries(row).forEach(([key, value]) => {
              const mapper = manualMapping.find((obj) => key.toLocaleUpperCase() === obj.source.toLocaleUpperCase());
              if (mapper) {
                row[mapper.target] = value;
                delete row[mapper.source];
                return;
              }
              delete row[key];
              row[key] = value;
            });
          }
          if (target) {
            return Mapper.sqlResultToObject(row, target);
          }
          return Mapper.sqlResultToObject(row);
        });

        const result = {
          data,
          getFirst: () => result.data[0],
          isEmpty: () => result.data.length === 0,
        };

        return result;
      }

      return queryResult;
    } catch (error) {
      if (throwException && throwException instanceof Function) {
        throwException(error);
      }
      if (throwException) {
        throw throwException;
      }
      throw error;
    } finally {
      if (!connection) {
        await this.closeConnection(connectionAux);
      }
    }
  }

  /**
   * Execute SQL query with pagination.
   *
   * @param {object} scheme - Scheme to Execute Query Pageable.
   * @param {string} scheme.connection - Database Connection.
   * @param {string} scheme.projection - Projection section of SQL Sentence.
   * @param {string} scheme.selection - Selection section of SQL Sentence.
   * @param {object} [scheme.values] - The query values.
   * @param {object} [scheme.target] - The object where the query result is linked.
   * @param {object[]} [scheme.manualMapping] - List of properties to mapping manually the query result.
   * @param {string} [scheme.manualMapping.target] - Target property
   * @param {string} [scheme.manualMapping.source] - Source property
   * @param {object} [scheme.options={ timeout: 15 }] - Option.
   * @param {Callback} [throwException] - Throw Exception if something fail .
   * @param {object} [scheme.pagination={ page = 0, size = 1}] - The parameters of pagination.
   * @param scheme.statement
   * @returns {object} Pageable query result.
   */

  async executeInsert({
    connection,
    statement,
    values,
    options = {},
  }, throwException) {
    let connectionAux;
    const { autocommit } = options;
    try {
      const test = /(\bINSERT\b[\w\W]*\bINTO\b[\w\W]*\bVALUES\b[\w\W]*)|(\binsert\b[\w\W]*\binto\b[\w\W]*\bvalues\b[\w\W]*)/.test(statement);
      if (!test) {
        new DataRepositoryException(
          ExceptionConstant.INVALID_STATEMENT_DATABASE_EXCEPTION.code,
          ExceptionConstant.INVALID_STATEMENT_DATABASE_EXCEPTION.message,
        ).throw();
      }
      connectionAux = connection || await this.getConnection();
      const query = await this._bindQueryParams(connectionAux, statement, values);
      if (autocommit === false) {
        await this._execute({
          connection: connectionAux, statement: 'SET autocommit = 0', options,
        });
      }

      const insertResult = await this._execute({
        connection: connectionAux, statement: query, options,
      });

      const result = {
        identifier: insertResult.insertId,
        getFirst: () => result.data[0],
      };

      return result;
    } catch (error) {
      if (throwException && throwException instanceof Function) {
        throwException(error);
      }
      if (throwException) {
        throw throwException;
      }
      throw error;
    } finally {
      if (!connection) {
        await this.closeConnection(connectionAux);
      }
    }
  }

  /**
   * Execute update SQL Statement.
   *
   * @param {object} scheme - Scheme to Execute SQL Statement.
   * @param {string} [scheme.connection] - Database Connection.
   * @param {(object | string)} scheme.statement - SQL Statement.
   * @param {object} [scheme.values] - The update values.
   * @param {object} [scheme.options={ timeout: 15, autocommit: true }] - Option.
   * @param {Callback} [throwException] - Throw Exception if something fail .
   * @returns {object | object[]} Query result.
   */
  async executeUpdate({
    connection,
    statement,
    values,
    options = {},
  }, throwException) {
    let connectionAux;
    const { autocommit } = options;
    try {
      const test = /(\bUPDATE\b[\w\W]*\bSET\b[\w\W]*\bWHERE\b[\w\W]*)|(\bupdate\b[\w\W]*\bset\b[\w\W]*\bwhere\b[\w\W]*)/.test(statement);
      if (!test) {
        new DataRepositoryException(
          ExceptionConstant.INVALID_STATEMENT_DATABASE_EXCEPTION.code,
          ExceptionConstant.INVALID_STATEMENT_DATABASE_EXCEPTION.message,
        ).throw();
      }
      connectionAux = connection || await this.getConnection();
      const query = await this._bindQueryParams(connectionAux, statement, values);
      if (autocommit === false) {
        await this._execute({
          connection: connectionAux, statement: 'SET autocommit = 0', options,
        });
      }

      const updateResult = await this._execute({
        connection: connectionAux, statement: query, options,
      });

      const result = {
        changedRows: updateResult.changedRows,
        getFirst: () => result.data[0],
      };

      return result;
    } catch (error) {
      if (throwException && throwException instanceof Function) {
        throwException(error);
      }
      if (throwException) {
        throw throwException;
      }
      throw error;
    } finally {
      if (!connection) {
        await this.closeConnection(connectionAux);
      }
    }
  }
}

module.exports = MySqlDriver;
