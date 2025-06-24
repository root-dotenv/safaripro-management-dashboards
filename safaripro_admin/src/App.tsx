import { useQuery } from "@tanstack/react-query";
import hotelClient from "./api/hotel-client";

function App() {
  const {
    data: hotels,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => {
      try {
        const response = await hotelClient.get(`v1/hotels/`);
        console.log(`Hotels Response`, response);
        return response;
      } catch (error) {
        console.error(error);
      }
    },
  });

  if (isLoading) return <p>Loading Data</p>;
  if (isError) return <p>An Error has occured {error.message}</p>;

  console.log(`- - - Debugging hotels`);
  console.log(hotels);

  return (
    <>
      <div className={`w-screen min-h-screen flex items-center justify-center`}>
        <p className="text-[1.25rem] font-bold text-blue-500">
          Yoko, Jakamoto, Toto
        </p>
      </div>
    </>
  );
}

export default App;
