// * - - - A quick links card in top navigation bar
import React from "react";
import { Link } from "react-router-dom";

interface QuickLinksCardProps {
  isOpen: boolean;
  onLinkClick: () => void;
}

const QuickLinksCard: React.FC<QuickLinksCardProps> = ({
  isOpen,
  onLinkClick,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute top-[96px] right-[1rem] w-[200px] bg-[#FFF] border-[#E8E8E8] border-[1.5px] rounded-md shadow z-10 py-2">
      <ul className="flex flex-col">
        <li>
          <Link
            to="/hotel-management/hotels/add-hotel"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={onLinkClick}
          >
            Create Hotel
          </Link>
        </li>
        <li>
          <Link
            to="/hotel-management/rooms/add-room-type"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={onLinkClick}
          >
            Add Room Types
          </Link>
        </li>
        <li>
          <Link
            to="/hotel-management/facilities/add-facility"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={onLinkClick}
          >
            Add Facilities
          </Link>
        </li>
        <li>
          <Link
            to="/hotel-management/amenities/add-amenity"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={onLinkClick}
          >
            Add Amenities
          </Link>
        </li>
        <li>
          <Link
            to="/hotel-management/features/add-feature"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={onLinkClick}
          >
            Add Features
          </Link>
        </li>
        <li>
          <Link
            to="/hotel-management/hotel-types/create-hotel-type"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={onLinkClick}
          >
            Create Hotel Types
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default QuickLinksCard;
