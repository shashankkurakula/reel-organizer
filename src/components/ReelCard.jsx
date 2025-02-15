export default function ReelCard({ reel }) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <img src={reel.thumbnail} alt={reel.title} className="w-full rounded-md" />
      <h2 className="text-lg font-semibold mt-2">{reel.title}</h2>
      <p className="text-sm text-gray-500">Collection: {reel.collection}</p>
      <p className="text-sm text-gray-500">
        Tags: {reel.tags.length > 0 ? reel.tags.join(", ") : "None"}
      </p>
      <a
        href={reel.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 mt-2 block"
      >
        View on Instagram
      </a>
    </div>
  );
}
