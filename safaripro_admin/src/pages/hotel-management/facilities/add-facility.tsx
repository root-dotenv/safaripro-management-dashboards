// safaripro_admin/src/routes/hotel-management/facilities/add-facility.tsx
/**
 * AddFacility Component
 * Provides a form for adding new facilities to a hotel or the system.
 */
export default function AddFacility() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-medium text-gray-700 mb-4">
        Add New Facility
      </h3>
      <p className="text-gray-600">
        Use this form to add a new facility, such as a swimming pool, gym, or
        spa.
      </p>
      {/* Add your form for adding facilities here */}
      <form className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="facilityName"
            className="block text-sm font-medium text-gray-700"
          >
            Facility Name
          </label>
          <input
            type="text"
            id="facilityName"
            name="facilityName"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Main Swimming Pool, Fitness Center"
          />
        </div>
        <div>
          <label
            htmlFor="facilityType"
            className="block text-sm font-medium text-gray-700"
          >
            Facility Type
          </label>
          <select
            id="facilityType"
            name="facilityType"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a type</option>
            <option value="pool">Swimming Pool</option>
            <option value="gym">Gym</option>
            <option value="spa">Spa</option>
            <option value="restaurant">Restaurant</option>
            <option value="bar">Bar</option>
            <option value="conference">Conference Room</option>
          </select>
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
            placeholder="Detailed description of the facility."
          ></textarea>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Facility
        </button>
      </form>
    </div>
  );
}
