import { useLocation, useNavigate } from "react-router-dom";

const BottomNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const showNavbar = ["/home", "/category", "/profile", "/orders"].some((path) =>
    location.pathname.startsWith(path)
  );

  if (!showNavbar) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 py-2 bg-white border-t shadow-md z-50">
      <div className="flex justify-around items-center py-3">
        <button
          className="text-center text-sm font-medium text-gray-800 cursor-pointer"
          onClick={() => navigate("/all-items")}
        >
          🍽 Menu
        </button>
        <button
          className="text-center text-sm font-medium text-gray-800 cursor-pointer"
          onClick={() => navigate("/orders")}
        >
          🔁 Reorder
        </button>
      </div>
    </nav>
  );
};

export default BottomNavbar;
