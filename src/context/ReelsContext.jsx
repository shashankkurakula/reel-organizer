import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const ReelsContext = createContext();

export const ReelsProvider = ({ children }) => {
  const [reels, setReels] = useState([]);

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

    fetchReels();
  }, []);

  const addReel = async (reel) => {
    try {
      const docRef = await addDoc(collection(db, "reels"), reel);
      setReels((prevReels) => [...prevReels, { id: docRef.id, ...reel }]);
    } catch (error) {
      console.error("Error adding reel:", error);
    }
  };

  return (
    <ReelsContext.Provider value={{ reels, addReel }}>
      {children}
    </ReelsContext.Provider>
  );
};

export const useReels = () => {
  return useContext(ReelsContext);
};
