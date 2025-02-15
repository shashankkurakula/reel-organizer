import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

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
        const collectionsSnapshot = await getDocs(collection(db, "collections"));
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
      // Check if the reel already exists
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

  return (
    <ReelsContext.Provider value={{ reels, addReel, collections, addCollection, tags, addTag }}>
      {children}
    </ReelsContext.Provider>
  );
};

export const useReels = () => {
  return useContext(ReelsContext);
};
