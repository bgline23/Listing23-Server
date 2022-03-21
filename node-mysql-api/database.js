import mysql from "mysql2/promise";

let connection = null;
let connectionOptions = null;

try {
  connectionOptions = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    multipleStatements: true,
  };

  //console.log(connectionOptions);

  connection = await mysql.createConnection(connectionOptions);
} catch (error) {
  console.log(error.message);
  console.log("Could not connect to databse with options: ", connectionOptions);
}

// query database
const getUserTypes = async () => {
  if (connection == null) {
    throw new Error("could not connect to database");
  }
  const [rows] = await connection.query("SELECT * FROM UserType;");
  return rows;
};

const getAuthenticatedUser = async (credentials) => {
  if (connection == null) {
    throw new Error("could not connect to database");
  }
  const [rows] = await connection.execute("CALL GetAuthenticatedUser(?,?)", [
    credentials.username,
    credentials.password,
  ]);

  return rows[0][0];
};

const savePropertyImage = async (propertyId, buffer) => {
  const [result] = await connection.execute(
    "CALL AddPropertyImage(?,BINARY(?));",
    [propertyId, buffer]
  );
  return result;
};

const getPropertyImages = async (propertyId) => {
  const [rows] = await connection.execute(
    "SELECT * FROM Images where propert_id = ?",
    [propertyId]
  );

  return rows[0];
};

const getListings = async (args) => {
  const params = [args.userId, args.pageSize, args.skipRows];
  const [rows] = await connection.execute("CALL GetListings(?,?,?)", params);

  return rows[0];
};

const createProperty = async (params) => {
  const record = {
    title: params.title,
    description: params.description,
    price: Number(params.price),
    address: params.address,
    coords: params.coords,
    autoCreateListing: params.autoCreateListing,
    userId: params.userId,
  };

  const spArguments = Object.values(record);

  const result = await connection.query(
    "CALL CreateProperty(?,?,?,?,?,?,?, @new_property); SELECT @new_property;",
    spArguments
  );

  return result[0];
};

export {
  getUserTypes,
  getAuthenticatedUser,
  savePropertyImage,
  getPropertyImages,
  createProperty,
  getListings,
};
