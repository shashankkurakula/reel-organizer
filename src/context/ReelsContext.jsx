import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../config/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

const ReelsContext = createContext();

export const ReelsProvider = ({ children }) => {
  const { user } = useAuth();
  const [reels, setReels] = useState([]);
  const [collections, setCollections] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchReels = async () => {
      try {
        const q = query(collection(db, "reels"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const reelsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReels(reelsData);
        setSearchResults(reelsData); // Default to all reels
      } catch (error) {
        console.error("❌ Error fetching reels:", error);
      }
    };

  const fetchCollectionsAndTags = async () => {
    try {
      const collectionsSnapshot = await getDocs(
        query(collection(db, "collections"), where("userId", "==", user.uid))
      );
      setCollections(collectionsSnapshot.docs.map((doc) => doc.data().name));

      const tagsSnapshot = await getDocs(query(collection(db, "tags"), where("userId", "==", user.uid)));
      setTags(tagsSnapshot.docs.map((doc) => doc.data().name));
    } catch (error) {
      console.error("❌ Error fetching collections/tags:", error);
    }
  };

    fetchReels();
    fetchCollectionsAndTags();
  }, [user]);

  const searchReels = (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults(reels);
      return;
    }

    const filteredReels = reels.filter(
      (reel) =>
        reel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reel.collections.some((col) =>
          col.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        reel.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    setSearchResults(filteredReels);
  };

  const addReel = async (reel) => {
    if (!user) return;

    try {
      const existingReel = reels.find((r) => r.url === reel.url);
      if (existingReel) {
        alert("Reel already exists!");
        return;
      }

      const reelWithUser = { ...reel, userId: user.uid };
      const docRef = await addDoc(collection(db, "reels"), reelWithUser);
      setReels((prevReels) => [...prevReels, { id: docRef.id, ...reelWithUser }]);
    } catch (error) {
      console.error("❌ Error adding reel:", error);
    }
  };

  const deleteReel = async (reelId) => {
    try {
      await deleteDoc(doc(db, "reels", reelId));
      setReels((prevReels) => prevReels.filter((reel) => reel.id !== reelId));
    } catch (error) {
      console.error("❌ Error deleting reel:", error);
    }
  };

  const addCollection = async (name) => {
    if (!user || collections.includes(name)) return;

    try {
      await addDoc(collection(db, "collections"), { name, userId: user.uid });
      setCollections([...collections, name]);
    } catch (error) {
      console.error("❌ Error adding collection:", error);
    }
  };

  const addTag = async (name) => {
    if (!user || tags.includes(name)) return;

    try {
      await addDoc(collection(db, "tags"), { name, userId: user.uid });
      setTags([...tags, name]);
    } catch (error) {
      console.error("❌ Error adding tag:", error);
    }
  };

  const deleteCollection = async (name) => {
    if (!user) return;

    try {
      // Step 1: Delete collection from Firestore
      const q = query(collection(db, "collections"), where("name", "==", name), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docSnap) => {
        await deleteDoc(docSnap.ref);
      });

      // Step 2: Remove collection from all reels
      const reelsQuery = query(
        collection(db, "reels"),
        where("collections", "array-contains", name),
        where("userId", "==", user.uid)
      );
      const reelsSnapshot = await getDocs(reelsQuery);

      for (const reelDoc of reelsSnapshot.docs) {
        const reelData = reelDoc.data();
        const updatedCollections = reelData.collections.filter((col) => col !== name);
        await updateDoc(doc(db, "reels", reelDoc.id), { collections: updatedCollections });
      }

      // Step 3: Update UI State
      setCollections((prev) => prev.filter((col) => col !== name));
      setReels((prevReels) =>
        prevReels.map((reel) => ({
          ...reel,
          collections: reel.collections.filter((col) => col !== name),
        }))
      );
    } catch (error) {
      console.error("❌ Error deleting collection:", error);
    }
  };

  const deleteTag = async (name) => {
    if (!user) return;

    try {
      // Step 1: Delete tag from Firestore
      const q = query(collection(db, "tags"), where("name", "==", name), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docSnap) => {
        await deleteDoc(docSnap.ref);
      });

      // Step 2: Remove tag from all reels
      const reelsQuery = query(
        collection(db, "reels"),
        where("tags", "array-contains", name),
        where("userId", "==", user.uid)
      );
      const reelsSnapshot = await getDocs(reelsQuery);

      for (const reelDoc of reelsSnapshot.docs) {
        const reelData = reelDoc.data();
        const updatedTags = reelData.tags.filter((tag) => tag !== name);
        await updateDoc(doc(db, "reels", reelDoc.id), { tags: updatedTags });
      }

      // Step 3: Update UI State
      setTags((prev) => prev.filter((tag) => tag !== name));
      setReels((prevReels) =>
        prevReels.map((reel) => ({
          ...reel,
          tags: reel.tags.filter((tag) => tag !== name),
        }))
      );
    } catch (error) {
      console.error("❌ Error deleting tag:", error);
    }
  };

  return (
    <ReelsContext.Provider
    value={{
      reels,
      addReel,
      deleteReel,
      collections,
      addCollection,
      deleteCollection,
      tags,
      addTag,
      deleteTag,
      searchResults,
      searchReels,
      setSearchResults,
    }}
    >
      {children}
    </ReelsContext.Provider>
  );
};

export const useReels = () => {
  return useContext(ReelsContext);
};
