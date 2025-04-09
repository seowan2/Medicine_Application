// client/src/pages/SearchPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import MedicationCard from '../components/MedicationCard';
import Pagination from '../components/Pagination';
import { medicationAPI } from '../services/api';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // 상태 관리
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(parseInt(queryParams.get('page')) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(parseInt(queryParams.get('limit')) || 10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 검색 파라미터 초기화
  const [searchParams, setSearchParams] = useState({
    keyword: queryParams.get('keyword') || '',
    shape: queryParams.get('shape') || '',
    color: queryParams.get('color') || '',
    formulation: queryParams.get('formulation') || '',
    divisionLine: queryParams.get('divisionLine') || ''
  });

  // URL 쿼리 파라미터로 검색 수행
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 모든 쿼리 파라미터 수집
        const params = {
          page: currentPage,
          limit: itemsPerPage
        };
        
        // 검색 파라미터 추가
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value) {
            params[key] = value;
          }
        });
        
        const response = await medicationAPI.search(params);
        setMedications(response.data.medications);
        setTotalItems(response.data.totalItems);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError('의약품 정보를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
    
    // URL 업데이트
    const queryParams = new URLSearchParams();
    queryParams.append('page', currentPage);
    queryParams.append('limit', itemsPerPage);
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    navigate(`/search?${queryParams.toString()}`, { replace: true });
  }, [currentPage, itemsPerPage, searchParams, navigate]);

  // 검색 핸들러
  const handleSearch = (newSearchParams) => {
    setSearchParams(newSearchParams);
    setCurrentPage(1); // 새 검색 시 첫 페이지로 이동
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // 페이지 상단으로 스크롤
  };

  // 페이지당 아이템 수 변경 핸들러
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // 첫 페이지로 이동
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">의약품 검색</h1>
      
      {/* 검색 폼 */}
      <div className="mb-8">
        <SearchForm onSearch={handleSearch} initialParams={searchParams} />
      </div>
      
      {/* 로딩 상태 표시 */}
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-3 text-gray-600">검색 중...</p>
        </div>
      )}
      
      {/* 에러 표시 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* 검색 결과 */}
      {!loading && !error && (
        <>
          {/* 검색 결과 요약 */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              총 <span className="font-semibold">{totalItems}</span>개의 결과
            </p>
            
            {/* 정렬 옵션 (향후 구현) */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">정렬:</span>
              <select className="border border-gray-300 rounded p-1 text-sm">
                <option value="relevance">관련도순</option>
                <option value="name_asc">이름 오름차순</option>
                <option value="name_desc">이름 내림차순</option>
              </select>
            </div>
          </div>
          
          {/* 의약품 목록 */}
          {medications.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {medications.map((medication) => (
                <MedicationCard key={medication.id} medication={medication} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">검색 결과가 없습니다.</p>
              <p className="text-gray-500 mt-2">다른 검색어로 시도해 보세요.</p>
            </div>
          )}
          
          {/* 페이지네이션 */}
          {medications.length > 0 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;