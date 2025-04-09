// client/src/components/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold mr-10">의약품 검색</Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/search" className="hover:text-green-200 transition">의약품 검색</Link>
              {currentUser && (
                <Link to="/my-medications" className="hover:text-green-200 transition">내 약품 관리</Link>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <span className="hidden md:inline">{currentUser.username}님</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-green-600 px-4 py-2 rounded-md hover:bg-green-100 transition"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white text-green-600 px-4 py-2 rounded-md hover:bg-green-100 transition"
                >
                  로그인
                </Link>
                <Link
                  to="/register"
                  className="bg-transparent border border-white text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;