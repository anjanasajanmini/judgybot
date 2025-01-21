import { db } from '@/lib/firebase/firebase';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, setDoc, deleteDoc } from 'firebase/firestore';
import type { ChatDocument } from '@/lib/types/chat';

export async function saveChat(chatData: Omit<ChatDocument, 'id'> & { id?: string }) {
    try {
        if (chatData.id) {
            // If ID is provided, use it
            const chatRef = doc(db, 'chats', chatData.id);
            await setDoc(chatRef, chatData);
            return chatData.id;
        } else {
            // If no ID, create new document
            const docRef = await addDoc(collection(db, 'chats'), chatData);
            return docRef.id;
        }
    } catch (error) {
        console.error('Error saving chat:', error);
        throw error;
    }
}

export async function updateChat(chatId: string, updates: Partial<ChatDocument>) {
    try {
        console.log('Updating chat with ID:', chatId);
        console.log('Update data:', updates);
        
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
            ...updates,
            updatedAt: Date.now()
        });

        // Verify the update
        const updatedDoc = await getDoc(chatRef);
        console.log('Updated document data:', updatedDoc.data());
    } catch (error) {
        console.error('Error updating chat:', error);
        throw error;
    }
}

export async function getChat(chatId: string) {
    try {
        console.log('Fetching chat:', chatId);
        const chatRef = doc(db, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);
        
        if (chatSnap.exists()) {
            const data = chatSnap.data();
            console.log('Chat data:', data);
            return {
                id: chatSnap.id,
                ...data,
                messages: data.messages || [],
                keyTakeaways: data.keyTakeaways || '',
                title: data.title || 'Untitled Decision',
                createdAt: data.createdAt || Date.now(),
                updatedAt: data.updatedAt || Date.now()
            } as ChatDocument;
        }
        return null;
    } catch (error) {
        console.error('Error getting chat:', error);
        throw error;
    }
}

export async function getUserChats(userId: string) {
    try {
        const q = query(
            collection(db, 'chats'),
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            keyTakeaways: doc.data().keyTakeaways || '',
            messages: doc.data().messages || [],
            title: doc.data().title || 'Untitled Decision',
            createdAt: doc.data().createdAt || Date.now(),
            updatedAt: doc.data().updatedAt || Date.now()
        })) as ChatDocument[];
    } catch (error) {
        console.error('Error getting user chats:', error);
        throw error;
    }
}

export async function deleteChat(chatId: string) {
    try {
        const chatRef = doc(db, 'chats', chatId);
        await deleteDoc(chatRef);
    } catch (error) {
        console.error('Error deleting chat:', error);
        throw error;
    }
} 