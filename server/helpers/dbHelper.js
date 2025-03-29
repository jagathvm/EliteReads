// Generic documents retrieval using aggregation pipeline
export const getAggregatedDocuments = async (
  pipeline = [],
  getCollection,
  errorMessage = "Error retrieving documents."
) => {
  try {
    const collection = await getCollection();
    const cursor = await collection.aggregate(pipeline);
    const documents = await cursor.toArray();

    if (!documents || documents.length === 0) {
      return {
        found: false,
        errorMessage,
      };
    }
    return { found: true, value: documents };
  } catch (error) {
    throw new Error(`Error retrieving documents: ${error}`);
  }
};

// Generic documents count
export const getDocumentsCount = async (query = {}, getCollection) => {
  try {
    const collection = await getCollection();
    const count = await collection.countDocuments(query);

    return count;
  } catch (error) {
    throw new Error(`Error retrieving documents count: ${error.message}`);
  }
};

// Generic documents retrieval
export const getDocuments = async (
  query = {},
  getCollection,
  errorMessage = "Error retrieving documents."
) => {
  try {
    const collection = await getCollection();
    const cursor = await collection.find(query);
    const documents = await cursor.toArray();

    if (!documents || documents.length === 0)
      return {
        found: false,
        errorMessage,
      };

    return { found: true, value: documents };
  } catch (error) {
    return {
      found: false,
      errorMessage: `Error retrieving documents: ${error.message}`,
    };
  }
};

// Generic document retrieval
export const getDocument = async (
  query,
  getCollection,
  errorMessage = "Document not found."
) => {
  try {
    const collection = await getCollection();
    const document = await collection.findOne(query);
    if (!document)
      return {
        found: false,
        errorMessage,
      };

    return {
      found: true,
      value: document,
    };
  } catch (error) {
    return {
      found: false,
      errorMessage: `Error retrieving document: ${error.message}`,
    };
  }
};

// Generic document addition
export const addDocument = async (document, getCollection) => {
  try {
    const collection = await getCollection();
    const result = await collection.insertOne(document);

    return result;
  } catch (error) {
    throw new Error(`Error adding document: ${error.message}`);
  }
};

// Generic document updation
export const updateDocument = async (query, operation, getCollection) => {
  try {
    const collection = await getCollection();
    const result = await collection.updateOne(query, operation);

    return result;
    // console.log("Update Result: ");
    // console.log(result);
  } catch (error) {
    console.error(`Error updating document: ${error.message}`);
    throw new Error(`Error updating document: ${error.message}`);
  }
};

// Generic document deletion
export const removeDocument = async (query, getCollection) => {
  try {
    const collection = await getCollection();
    const result = await collection.deleteOne(query);

    return result;
  } catch (error) {
    throw new Error(`Error deleting document: ${error.message}`);
  }
};
