import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function AllBookings() {
  const {
    data: all_bookings,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await axios.get(
        "https://z6dxlq7q-8010.euw.devtunnels.ms/api/v1/bookings?microservice_item_id=0748429d-5d3e-4400-b84e-32c91a34b22e"
      );
      console.log(`Execution reached the debug line`);
      return response.data;
    },
  });

  if (isLoading) return <p>Loading data</p>;

  if (isError) return <p>An Error has occured : {error.message}</p>;

  // - - - debuggings & state update
  // TODO : create a state and a booking state update function so that once the bookings are successful fetched, store them to the state (zustand) for easier access to other routes globally

  console.log(all_bookings);

  return <div>bookings are out</div>;
}
