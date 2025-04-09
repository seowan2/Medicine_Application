// client/src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 푸터 로고 및 간단한 설명 */}
          <div>
            <h2 className="text-white text-lg font-bold mb-4">의약품 검색 및 관리</h2>
            <p className="text-sm mb-4">
              정확하고 신뢰할 수 있는 의약품 정보를 제공하고, 개인 복용약을 효과적으로 관리할 수 있는 서비스입니다.
            </p>
          </div>
          
          {/* 기본 메뉴 링크 */}
          <div>
            <h3 className="text-white font-semibold mb-4">메뉴</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-white transition">홈</Link>
              </li>
              <li>
                <Link to="/search" className="text-sm hover:text-white transition">의약품 검색</Link>
              </li>
              <li>
                <Link to="/my-medications" className="text-sm hover:text-white transition">내 복용약 관리</Link>
              </li>
            </ul>
          </div>
          
          {/* 계정 관련 링크 */}
          <div>
            <h3 className="text-white font-semibold mb-4">계정</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-sm hover:text-white transition">로그인</Link>
              </li>
              <li>
                <Link to="/register" className="text-sm hover:text-white transition">회원가입</Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 저작권 정보 */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            &copy; {currentYear} 의약품 검색 및 관리 서비스. All rights reserved.
          </p>
          
          {/* 이용약관 및 개인정보처리방침 링크 */}
          <div className="flex space-x-4">
            <a href="#" className="text-xs hover:text-white transition">
              이용약관
            </a>
            <a href="#" className="text-xs hover:text-white transition">
              개인정보처리방침
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;