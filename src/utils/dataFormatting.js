export const formatMongoDbObjects = (mongoDbObject) => {
  if (!mongoDbObject) return null;

  // Handle Mongoose document or plain object
  const obj = mongoDbObject.toObject
    ? mongoDbObject.toObject()
    : { ...mongoDbObject };

  // Remove unwanted fields
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;

  return obj;
};
