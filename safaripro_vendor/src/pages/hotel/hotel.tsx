// pages/hotel.tsx
import { useHotel } from "../../providers/hotel-provider";

// - - - Renders hotel details
export default function Hotel() {
  const { hotel, loading, error } = useHotel();

  console.log(`- - - Debugging hotel objbect : hotel.tsx`);
  console.log(hotel);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-700">
          Loading hotel details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700">
        <div className="text-lg font-semibold">{error}</div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-100 text-yellow-700">
        <div className="text-lg font-semibold">No hotel data available.</div>
      </div>
    );
  }

  // - - - Render UI
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
          {hotel.name}
        </h1>
        <p className="text-lg text-gray-600 mb-6 text-center">
          {hotel.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">Location</h2>
            <p className="text-gray-700">
              <span className="font-semibold">Address:</span> {hotel.address},{" "}
              {hotel.zip_code}, {hotel.country}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Destination:</span>{" "}
              {hotel.destination}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Latitude:</span>{" "}
              {hotel.latitude?.toFixed(4)},{" "}
              <span className="font-semibold">Longitude:</span>{" "}
              {hotel.longitude?.toFixed(4)}
            </p>
            {hotel.google_maps_url && (
              <a
                href={hotel.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                View on Google Maps
              </a>
            )}
          </div>

          <div className="bg-green-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-green-800 mb-3">Details</h2>
            <p className="text-gray-700">
              <span className="font-semibold">Star Rating:</span>{" "}
              {hotel.star_rating} ⭐
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Number of Rooms:</span>{" "}
              {hotel.number_rooms}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Occupancy Rate:</span>{" "}
              {(hotel.occupancy_rate * 100).toFixed(2)}%
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Average Room Price:</span> $
              {hotel.average_room_price?.toFixed(2)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Year Built:</span>{" "}
              {hotel.year_built}
            </p>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-purple-800 mb-3">
            Amenities & Services
          </h2>
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">
                Amenities:
              </h3>
              <ul className="list-disc list-inside text-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                {hotel.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
          )}
          {hotel.services && hotel.services.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-purple-700 mb-2">
                Services:
              </h3>
              <ul className="list-disc list-inside text-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                {hotel.services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
          )}
          {hotel.amenities?.length === 0 && hotel.services?.length === 0 && (
            <p className="text-gray-700">No amenities or services listed.</p>
          )}
        </div>

        <div className="bg-orange-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-orange-800 mb-3">
            Contact & Social
          </h2>
          {hotel.website_url && (
            <p className="text-gray-700">
              <span className="font-semibold">Website:</span>{" "}
              <a
                href={hotel.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                {hotel.website_url}
              </a>
            </p>
          )}
          {hotel.facebook_url && (
            <p className="text-gray-700">
              <span className="font-semibold">Facebook:</span>{" "}
              <a
                href={hotel.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                {hotel.facebook_url}
              </a>
            </p>
          )}
          {hotel.instagram_url && (
            <p className="text-gray-700">
              <span className="font-semibold">Instagram:</span>{" "}
              <a
                href={hotel.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                {hotel.instagram_url}
              </a>
            </p>
          )}
          {hotel.twitter_url && (
            <p className="text-gray-700">
              <span className="font-semibold">Twitter:</span>{" "}
              <a
                href={hotel.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                {hotel.twitter_url}
              </a>
            </p>
          )}
          {hotel.youtube_url && (
            <p className="text-gray-700">
              <span className="font-semibold">YouTube:</span>{" "}
              <a
                href={hotel.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                {hotel.youtube_url}
              </a>
            </p>
          )}
          {!hotel.website_url &&
            !hotel.facebook_url &&
            !hotel.instagram_url &&
            !hotel.twitter_url &&
            !hotel.youtube_url && (
              <p className="text-gray-700">
                No social media or website links available.
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
