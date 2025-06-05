import { useState, useRef, useEffect, useContext } from 'react';
import { useUser } from '@/src/context/userContext';
import defaultProfileImage from '@/public/images/defaultProfile.jpeg';
import router from 'next/router';

const ProfileNavbar = () => {
    const { logout,user } = useUser();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout()
        router.push('/');
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {user && (
                <button
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 border-2 border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                    <img
                        src={user?.profile || defaultProfileImage.src}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                    />
                    <span className=' text-sky-500 font-mono text-lg'>{user?.name}</span>
                </button>
            )}

            {isDropdownOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 border-2 border-gray-500 bg-white text-black dark:bg-gray-800 dark:text-white rounded shadow-md py-2">
                    <a href="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        My Profile
                    </a>
                    <a href="/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Settings
                    </a>
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileNavbar;

