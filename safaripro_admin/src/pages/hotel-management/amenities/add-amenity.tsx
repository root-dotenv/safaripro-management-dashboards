// safaripro_admin/src/routes/hotel-management/amenities/add-amenity.tsx
/**
 * AddAmenity Component
 * Provides a form for adding new amenities that can be associated with rooms or hotels.
 */
export default function AddAmenity() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-medium text-gray-700 mb-4">
        Add New Amenity
      </h3>
      <p className="text-gray-600">
        Use this form to add a new amenity (e.g., Wi-Fi, Air Conditioning,
        Minibar).
      </p>
      {/* Add your form for adding amenities here */}
      <form className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="amenityName"
            className="block text-sm font-medium text-gray-700"
          >
            Amenity Name
          </label>
          <input
            type="text"
            id="amenityName"
            name="amenityName"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Free Wi-Fi, Breakfast Included, Parking"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of the amenity."
          ></textarea>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Amenity
        </button>
      </form>
    </div>
  );
}
