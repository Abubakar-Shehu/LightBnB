const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "lightbnb",
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`,[email])
    .then(result => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool.query(`SELECT * FROM users WHERE id = $1 LIMIT 1`,[id])
    .then(result => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [user.name, user.email, user.password])
    .then(result => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool.query(`
  SELECT reservations.id, properties.title, properties.cost_per_night, reservations.start_date, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1 AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`, [guest_id, limit])
    .then(result => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id
  `;

  let whereClauses = [];

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    whereClauses.push(`owner_id = $${queryParams.length}`);
  }

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    whereClauses.push(`city LIKE $${queryParams.length}`);
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100); // Convert dollars to cents
    whereClauses.push(`cost_per_night >= $${queryParams.length}`);
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100); // Convert dollars to cents
    whereClauses.push(`cost_per_night <= $${queryParams.length}`);
  }

  if (whereClauses.length > 0) {
    queryString += `WHERE ${whereClauses.join(' AND ')} `;
  }
    // 4
  queryParams.push(limit);
  
  queryString += `GROUP BY properties.id\n`;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(rating) >= $${queryParams.length}\n`;
  }

  queryString +=`
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 6
  return pool.query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
return pool.query(`
  INSERT INTO properties (
  owner_id, 
  title, 
  description,
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  street,
  city,
  province,
  post_code,
  country,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms
  ) 
  VALUES (
  $1, 
  $2, 
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10,
  $11,
  $12,
  $13,
  $14
  ) 
  RETURNING *
  `, 
  [ property.owner_id, 
    property.title, 
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms])
  .then(result => {
    return result.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
  });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
