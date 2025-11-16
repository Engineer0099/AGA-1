import { databases } from "@/lib/appwrite";
import NetInfo from '@react-native-community/netinfo';
import { ID, Query } from "react-native-appwrite";

export async function isOnline(): Promise<boolean> {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  } catch (error) {
    console.error("Failed to check network status", error);
    return false;
  }
}


export async function fetchAllDocuments(databaseId: string, collectionId: string): Promise<any[]> {
  let allDocs: any[] = [];
  let lastId = null;

  while (true) {
    // Prepare query list
    let queries = [
      Query.limit(100),
      Query.orderAsc("$id")    // order is required for cursorAfter
    ];

    if (lastId) {
      queries.push(Query.cursorAfter(lastId));
    }

    // Fetch a batch
    const result = await databases.listDocuments(
      databaseId,
      collectionId,
      queries
    );

    // Add to final array
    allDocs = [...allDocs, ...result.documents];

    // If less than 100 returned → we reached the end
    if (result.documents.length < 100) break;

    // Update cursor for next batch
    lastId = result.documents[result.documents.length - 1].$id;
  }

  return allDocs;
}

// fetch a single document by ID
export async function fetchDocumentById(databaseId: string, collectionId: string, documentId: string): Promise<any | null> {
  try {
    const document = await databases.getDocument(databaseId, collectionId, documentId);
    return document;
  } catch (error) {
    console.error(`Failed to fetch document ${documentId}:`, error);
    return null;
  }
}

// update a document by ID
export async function updateDocumentById(databaseId: string, collectionId: string, documentId: string, data: any): Promise<any | null> {
  try {
    const updatedDocument = await databases.updateDocument(databaseId, collectionId, documentId, data);
    return updatedDocument;
  } catch (error) {
    console.error(`Failed to update document ${documentId}:`, error);
    return null;
  }
}

// delete a document by ID
export async function deleteDocumentById(databaseId: string, collectionId: string, documentId: string): Promise<boolean> {
  try {
    await databases.deleteDocument(databaseId, collectionId, documentId);
    return true;
  } catch (error) {
    console.error(`Failed to delete document ${documentId}:`, error);
    return false;
  }
}

// create a new document
export async function createDocument(databaseId: string, collectionId: string, data: any): Promise<any | null> {
  try {
    const newDocument = await databases.createDocument(databaseId, collectionId, ID.unique(), data);
    return newDocument;
  } catch (error) {
    console.error(`Failed to create document in collection ${collectionId}:`, error);
    return null;
  }
}

// fetch documents with a query
export async function fetchDocumentsWithQuery(databaseId: string, collectionId: string, queries: any[]): Promise<any[]> {
  try {
    const result = await databases.listDocuments(databaseId, collectionId, queries);
    return result.documents;
  } catch (error) {
    console.error(`Failed to fetch documents with query in collection ${collectionId}:`, error);
    return [];
  }
}

// fetch documents with multiple queries
export async function fetchDocumentsWithQueries(databaseId: string, collectionId: string, queriesArray: any[][]): Promise<any[]> {
  try {
    let allDocuments: any[] = [];
    for (const queries of queriesArray) {
      const result = await databases.listDocuments(databaseId, collectionId, queries);
      allDocuments = allDocuments.concat(result.documents);
    }
    return allDocuments;
  } catch (error) {
    console.error(`Failed to fetch documents with multiple queries in collection ${collectionId}:`, error);
    return [];
  }
}

// fetch number of documents in a collection
export async function fetchDocumentCount(databaseId: string, collectionId: string): Promise<number> {
  try {
    const result = await fetchAllDocuments(databaseId, collectionId);
    return result.length;
  } catch (error) {
    console.error(`Failed to fetch document count in collection ${collectionId}:`, error);
    return 0;
  }
}

// fetch recent activity logs
export async function fetchRecentActivityLogs(databaseId: string, collectionId: string, limit: number = 5): Promise<any[]> {
  try {
    const result = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.orderDesc('$createdAt'), Query.limit(limit)]
    );
    return result.documents;
  } catch (error) {
    console.error(`Failed to fetch recent activity logs in collection ${collectionId}:`, error);
    return [];
  }
}
