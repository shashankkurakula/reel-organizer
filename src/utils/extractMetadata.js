const extractMetadata = async (url) => {
    try {
      const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
      const text = await response.text();
  
      const titleMatch = text.match(/<meta property="og:title" content="(.*?)"/);
      const imageMatch = text.match(/<meta property="og:image" content="(.*?)"/);
  
      return titleMatch && imageMatch
        ? { title: titleMatch[1], thumbnail: imageMatch[1], url }
        : null;
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return null;
    }
  };
  
  export default extractMetadata;
  