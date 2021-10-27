/** User class for message.ly */
/** starter code (class name, static function names and arguments) by Colt Steele and/or Rithm School and/or Springboard */
/** All actual code and depdencies by Tor Kingdon */
const bcrypt = require("bcrypt");
const { 
  BCRYPT_WORK_FACTOR,
  SECRET_KEY 
} = require("../config");
const db = require("../db");
const jwt = require("jsonwebtoken");
const ExpressError = require("../expressError");

/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) { 
    const now = new Date();
    const hashedPass = await bcrypt.hash( password, BCRYPT_WORK_FACTOR );
    const result = await db.query(
      `INSERT INTO users
        (username, 
          password, 
          first_name, 
          last_name, 
          phone, 
          join_at, 
          last_login_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING username, password, first_name, last_name, phone`,
      [ username, hashedPass, first_name, last_name, phone, now, now ]
    );

    return result.rows[0];
  };

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) { 
    const result = await db.query(
      `SELECT username, password
      FROM users`
    );
    const user = result.rows[0];
    let isPasswordRight = await bcrypt.compare(password, user.password);
    
    return user && isPasswordRight;
  };

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { 
    // const result = await.db.query(
    //   `SELECT username, last_login_at
    //   FROM users
    //   WHERE username = $1`,
    //   [ username ]
    // );
    const now = new Date();
    const result = await db.query(
      `UPDATE users
      SET last_login_at = $1
      WHERE username = $2
      RETURNING username, last_login_at`,
      [ now, username ]
    );
    return result.rows[0];
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { 
    const results = await db.query(
      `SELECT username, first_name, last_name, phone
      FROM users`
    );
    return results.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { 
    const result = await db.query(
      `SELECT username, first_name, last_name, phone, join_at, last_login_at
      FROM users
      WHERE username = $1`,
      [ username ]
    );
    return result.rows[0]
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { }
}


module.exports = User;