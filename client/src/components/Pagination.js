// client/src/components/Pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // 한 번에 표시할 최대 페이지 번호 수
    
    if (totalPages <= maxPagesToShow) {
      // 전체 페이지가 maxPagesToShow 이하일 경우 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 현재 페이지 주변 페이지를 표시
      const halfWay = Math.floor(maxPagesToShow / 2);
      
      let startPage = currentPage - halfWay;
      let endPage = currentPage + halfWay;
      
      if (startPage < 1) {
        // 시작 페이지가 1보다 작을 경우 조정
        startPage = 1;
        endPage = maxPagesToShow;
      }
      
      if (endPage > totalPages) {
        // 끝 페이지가 전체 페이지 수보다 클 경우 조정
        endPage = totalPages;
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  // 페이지별 표시 개수 옵션
  const itemsPerPageOptions = [10, 20, 30, 50];

  return (
    <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 mt-4">
      {/* 페이지별 표시 개수 선택 */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">표시 개수:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded p-1 text-sm"
        >
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>{option}개</option>
          ))}
        </select>
      </div>
      
      {/* 페이지 이동 버튼 */}
      <div className="flex items-center space-x-1">
        {/* 처음 페이지로 */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          &laquo;
        </button>
        
        {/* 이전 페이지로 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          &lsaquo;
        </button>
        
        {/* 페이지 번호 */}
        {getPageNumbers().map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`px-3 py-1 rounded-md ${
              currentPage === pageNumber
                ? 'bg-green-600 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {pageNumber}
          </button>
        ))}
        
        {/* 다음 페이지로 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          &rsaquo;
        </button>
        
        {/* 마지막 페이지로 */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          &raquo;
        </button>
      </div>
      
      {/* 페이지 정보 표시 */}
      <div className="text-sm text-gray-600">
        {totalPages > 0 ? (
          <span>
            {currentPage} / {totalPages} 페이지
          </span>
        ) : (
          <span>데이터가 없습니다</span>
        )}
      </div>
    </div>
  );
};

export default Pagination;