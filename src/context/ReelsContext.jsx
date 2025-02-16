import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
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

const ReelsContext = createContext();

export const ReelsProvider = ({ children }) => {
  const [reels, setReels] = useState([]);
  const [collections, setCollections] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reels"));
        const reelsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReels(reelsData);
      } catch (error) {
        console.error("Error fetching reels:", error);
      }
    };

    const fetchCollectionsAndTags = async () => {
      try {
        const collectionsSnapshot = await getDocs(
          collection(db, "collections")
        );
        setCollections(collectionsSnapshot.docs.map((doc) => doc.data().name));

        const tagsSnapshot = await getDocs(collection(db, "tags"));
        setTags(tagsSnapshot.docs.map((doc) => doc.data().name));
      } catch (error) {
        console.error("Error fetching collections/tags:", error);
      }
    };

    fetchReels();
    fetchCollectionsAndTags();
  }, []);

  const addReel = async (reel) => {
    try {
      const existingReel = reels.find((r) => r.url === reel.url);
      if (existingReel) {
        alert("Reel already exists!");
        return;
      }

      const docRef = await addDoc(collection(db, "reels"), reel);
      setReels((prevReels) => [...prevReels, { id: docRef.id, ...reel }]);
    } catch (error) {
      console.error("Error adding reel:", error);
    }
  };

  const deleteReel = async (reelId) => {
    try {
      console.log(`Deleting reel: ${reelId}...`);

      // Step 1: Delete from Firestore
      await deleteDoc(doc(db, "reels", reelId));

      // Step 2: Update UI State
      setReels((prevReels) => prevReels.filter((reel) => reel.id !== reelId));

      console.log(`Reel ${reelId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting reel:", error);
    }
  };

  const addCollection = async (name) => {
    if (!collections.includes(name)) {
      await addDoc(collection(db, "collections"), { name });
      setCollections([...collections, name]);
    }
  };

  const addTag = async (name) => {
    if (!tags.includes(name)) {
      await addDoc(collection(db, "tags"), { name });
      setTags([...tags, name]);
    }
  };

  const deleteCollection = async (name) => {
    try {
      // Step 1: Delete from Firestore collections table
      const q = query(collection(db, "collections"), where("name", "==", name));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docSnap) => {
        await deleteDoc(docSnap.ref);
      });

      // Step 2: Remove collection from all reels
      const reelsQuery = query(
        collection(db, "reels"),
        where("collections", "array-contains", name)
      );
      const reelsSnapshot = await getDocs(reelsQuery);

      for (const reelDoc of reelsSnapshot.docs) {
        const reelData = reelDoc.data();
        const updatedCollections = reelData.collections.filter(
          (col) => col !== name
        );
        await updateDoc(doc(db, "reels", reelDoc.id), {
          collections: updatedCollections,
        });
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
      console.error("Error deleting collection:", error);
    }
  };

  const deleteTag = async (name) => {
    try {
      // Step 1: Delete from Firestore tags table
      const q = query(collection(db, "tags"), where("name", "==", name));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docSnap) => {
        await deleteDoc(docSnap.ref);
      });

      // Step 2: Remove tag from all reels
      const reelsQuery = query(
        collection(db, "reels"),
        where("tags", "array-contains", name)
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
      console.error("Error deleting tag:", error);
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
      }}
    >
      {children}
    </ReelsContext.Provider>
  );
};

export const useReels = () => {
  return useContext(ReelsContext);
};
