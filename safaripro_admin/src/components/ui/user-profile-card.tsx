// * - - - A user's profile card in top navigation bar
import React from "react";

interface UserProfileCardProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute top-[56px] border-[#E8E8E8] border-[1.5px] right-[1rem] w-[320px] h-[450px] bg-[#FFF] z-10 rounded-md shadow">
      {/* - - - User's profile details */}
      <div className="p-4">
        <p>user's profile details, I'll add these soon enough</p>
        {/* <h3 className="text-lg font-semibold text-gray-800">User Profile</h3>
        <p className="text-sm text-gray-600">Details about the user...</p>
        <button
          onClick={onClose}
          className="mt-4 p-2 bg-red-500 text-white rounded"
        >
          Close Profile
        </button> */}
      </div>
    </div>
  );
};

export default UserProfileCard;
