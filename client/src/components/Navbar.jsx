import { MdUpload } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex-between h-16 w-full border-b border-line bg-surface/90 px-6 backdrop-blur-md">
      {/* 1. Left Section: Logo */}
      <div className="font-bold text-xl text-text-main">Logo</div>

      {/* 2. Center Section: Search */}
      <div className="text-sm text-text-muted">Search</div>

      {/* 3. Right Section: User / Sign In */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <button className="btn-secondary">
              <MdUpload className="text-lg" />
              <span>Upload</span>
            </button>

            <button className="btn-icon">
              <IoNotificationsOutline className="text-xl" />
            </button>

            <img
              src={user.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
              alt={user.username}
              className="avatar"
            />
          </>
        ) : (
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
