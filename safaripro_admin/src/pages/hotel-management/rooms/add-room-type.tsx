// safaripro_admin/src/routes/hotel-management/rooms/add-room-type.tsx
/**
 * AddRoomType Component
 * Provides a form for adding new room types to the system.
 */
export default function AddRoomType() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-medium text-gray-700 mb-4">
        Add New Room Type
      </h3>
      <p className="text-gray-600">
        Use this form to define new room categories (e.g., Standard, Deluxe,
        Suite).
      </p>
      {/* Add your form for adding room types here */}
      <form className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="roomTypeName"
            className="block text-sm font-medium text-gray-700"
          >
            Room Type Name
          </label>
          <input
            type="text"
            id="roomTypeName"
            name="roomTypeName"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Standard Double, Executive Suite"
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
            placeholder="Brief description of the room type's features and amenities."
          ></textarea>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Room Type
        </button>
      </form>
    </div>
  );
}
