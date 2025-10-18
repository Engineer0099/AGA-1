import { databases } from '@/lib/appwrite';
import { unique } from 'react-native-appwrite';

const findDbId = (collection) => {
    switch (collection) {
        case 'study_tip':
            return '68ca66480039a017b799'; // Database ID for study_tip collection
        case 'another_collection':
            return 'your_database_id_here'; // Replace with actual Database ID
        default:
            throw new Error(`Unknown collection: ${collection}`);
    }
};

// Function to create a new document in a specified collection
export const createDocument = async (collectionId, data) => {
    const databaseId = databaseId(collectionId);
  try {
    const response = await databases.createDocument(
      '68ca4989003b47647dea', // Project ID
      collectionId,          // Collection ID
        unique(),            // Document ID (auto-generated)
        data                   // Document data
    );
    return response;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

// Function to retrieve documents from a specified collection
export const getDocuments = async (collectionId) => {
    const databaseId = findDbId(collectionId);
  try {
    const response = await databases.listDocuments(
        databaseId, // Project ID
        collectionId            // Collection ID
    );
    return response.documents;
  } catch (error) {
    console.error('Error retrieving documents:', error);
    throw error;
  }
};

// Function to retrieve a single document by its ID from a specified collection
export const getDocumentById = async (collectionId, documentId) => {
  try {
    const response = await databases.getDocument(
        '68ca4989003b47647dea', // Project ID
        collectionId,          // Collection ID
        documentId             // Document ID
    );
    return response;
  } catch (error) {
    console.error('Error retrieving document by ID:', error);
    throw error;
  }
};

// Function to update a document in a specified collection
export const updateDocument = async (collectionId, documentId, data) => {
  try {
    const response = await databases.updateDocument(
        '68ca4989003b47647dea', // Project ID
        collectionId,          // Collection ID
        documentId,            // Document ID
        data                   // Updated document data
    );
    return response;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Function to delete a document from a specified collection
export const deleteDocument = async (collectionId, documentId) => {
  try {
    const response = await databases.deleteDocument(
        '68ca4989003b47647dea', // Project ID
        collectionId,          // Collection ID
        documentId             // Document ID
    );
    return response;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Function to query documents in a specified collection with filters
export const queryDocuments = async (collectionId, filters) => {
  try {
    const response = await databases.listDocuments(
        '68ca4989003b47647dea', // Project ID
        collectionId,          // Collection ID
        filters                // Query filters
    );
    return response.documents;
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
};
