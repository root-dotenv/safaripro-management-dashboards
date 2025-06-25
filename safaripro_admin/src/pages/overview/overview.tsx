// - - - Overview/Home Route display page
export default function MainOverview() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 dark:text-white">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-300">Total Rooms</h3>
          <p className="text-2xl font-bold dark:text-white">120</p>
        </div>
      </div>
    </div>
  );
}
