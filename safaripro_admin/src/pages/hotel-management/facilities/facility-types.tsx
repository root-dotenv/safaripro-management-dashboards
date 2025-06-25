// safaripro_admin/src/routes/hotel-management/facilities/facility-types.tsx
/**
 * FacilityTypes Component
 * Displays a list of all defined facility types.
 */
export default function FacilityTypes() {
  const dummyFacilityTypes = [
    {
      id: 1,
      name: "Swimming Pool",
      description: "Recreational water facility.",
    },
    {
      id: 2,
      name: "Gym",
      description: "Fitness center with various exercise equipment.",
    },
    {
      id: 3,
      name: "Restaurant",
      description: "Dining establishment serving meals.",
    },
    { id: 4, name: "Spa", description: "Wellness center offering treatments." },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-medium text-gray-700 mb-4">
        Manage Facility Types
      </h3>
      <p className="text-gray-600 mb-4">
        Here you can view and manage all types of facilities available across
        your hotels.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Facility Type Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dummyFacilityTypes.map((type) => (
              <tr key={type.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {type.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {type.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {type.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </a>
                  <a href="#" className="text-red-600 hover:text-red-900">
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
