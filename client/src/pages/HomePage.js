// client/src/pages/HomePage.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import SearchForm from '../components/SearchForm';

const HomePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const handleSearch = (searchParams) => {
    // 검색 파라미터를 URL 쿼리 파라미터로 변환
    const queryParams = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    navigate(`/search?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 메인 배너 */}
      <div 
        className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 md:py-24 px-4"
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <div className="container mx-auto max-w-5xl flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6">
            의약품 검색 및 관리
          </h1>
          <p className="text-xl md:text-2xl text-center mb-12 max-w-2xl">
            내가 복용하는 약에 대한 정보를 쉽게 검색하고 관리할 수 있습니다.
          </p>

          <div className="w-full max-w-3xl">
            <SearchForm onSearch={handleSearch} />
          </div>

          {/* 주요 기능 바로가기 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-3xl">
            <Link
              to="/search"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-40 rounded-lg p-6 transition flex flex-col items-center text-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">의약품 검색</h3>
              <p className="text-sm opacity-90">
                의약품 이름, 성분, 효능 또는 외형 특징으로 찾아보세요.
              </p>
            </Link>

            <Link
              to={currentUser ? "/my-medications" : "/login"}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-40 rounded-lg p-6 transition flex flex-col items-center text-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">내 복용약 관리</h3>
              <p className="text-sm opacity-90">
                {currentUser
                  ? "자주 복용하는 약품을 저장하고 관리하세요."
                  : "로그인하여 복용약을 관리하세요."}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;