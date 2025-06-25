// safaripro_admin/src/routes/hotel-management/facilities/all-facilities.tsx
/**
 * AllFacilities Component
 * Displays a list of all facilities available at various hotels. This is the default view for the /hotel-management/facilities path.
 */
export default function AllFacilities() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-medium text-gray-700 mb-4">All Facilities</h3>
      <p className="text-gray-600">
        This page will display a comprehensive list of all facilities, e.g.,
        Swimming Pool, Gym, Restaurant.
      </p>
      {/* Add your facilities listing table/components here */}
      <div className="mt-4 border p-4 rounded-md bg-yellow-50">
        <p className="text-gray-500 text-sm">
          Placeholder for facility data table.
          <br />
          e.g., Swimming Pool (Main Hotel), Fitness Center (Annex)
        </p>
      </div>
    </div>
  );
}
