// client/src/components/SearchForm.js
import React, { useState } from 'react';

// 제형 옵션 정의
const formulationOptions = [
  { value: '', label: '전체' },
  { value: '원형', label: '원형' },
  { value: '타원형', label: '타원형' },
  { value: '반원형', label: '반원형' },
  { value: '삼각형', label: '삼각형' },
  { value: '사각형', label: '사각형' },
  { value: '마름모형', label: '마름모형' },
  { value: '장방형', label: '장방형' },
  { value: '오각형', label: '오각형' },
  { value: '육각형', label: '육각형' }
];

// 색상 옵션 정의
const colorOptions = [
  { value: '', label: '전체' },
  { value: '하양', label: '하양' },
  { value: '노랑', label: '노랑' },
  { value: '주황', label: '주황' },
  { value: '분홍', label: '분홍' },
  { value: '빨강', label: '빨강' },
  { value: '갈색', label: '갈색' },
  { value: '연두', label: '연두' },
  { value: '초록', label: '초록' },
  { value: '청록', label: '청록' }
];

// 제형 옵션 정의
const shapeOptions = [
  { value: '', label: '전체' },
  { value: '정제류', label: '정제류' },
  { value: '경질캡슐', label: '경질캡슐' },
  { value: '연질캡슐', label: '연질캡슐' }
];

// 분할선 옵션 정의
const divisionLineOptions = [
  { value: '', label: '전체' },
  { value: '없음', label: '없음' },
  { value: '(-)형', label: '(-)형' },
  { value: '(+)형', label: '(+)형' },
  { value: '기타', label: '기타' }
];

const SearchForm = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    shape: '',
    color: '',
    formulation: '',
    divisionLine: ''
  });

  const [advanced, setAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleReset = () => {
    setSearchParams({
      keyword: '',
      shape: '',
      color: '',
      formulation: '',
      divisionLine: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <form onSubmit={handleSubmit}>
        {/* 기본 검색창 */}
        <div className="flex mb-4">
          <input
            type="text"
            name="keyword"
            value={searchParams.keyword}
            onChange={handleChange}
            placeholder="약 이름 또는 성분 등으로 검색해 보세요."
            className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-r-md hover:bg-green-700 transition"
          >
            검색
          </button>
        </div>

        {/* 고급 검색 토글 버튼 */}
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={() => setAdvanced(!advanced)}
            className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
          >
            {advanced ? '간편 검색' : '의약품 식별검색'} 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={advanced ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>
          
          {advanced && (
            <button
              type="button"
              onClick={handleReset}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              초기화
            </button>
          )}
        </div>

        {/* 고급 검색 옵션 */}
        {advanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 모양 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">모양</label>
              <div className="grid grid-cols-5 gap-2">
                {formulationOptions.map((option) => (
                  <div key={option.value} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setSearchParams({ ...searchParams, formulation: option.value })}
                      className={`w-12 h-12 rounded-full border ${
                        searchParams.formulation === option.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300'
                      } flex items-center justify-center mb-1`}
                    >
                      {option.label === '전체' ? '전체' : ''}
                    </button>
                    <span className="text-xs">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 색상 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">색상</label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((option) => (
                  <div key={option.value} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setSearchParams({ ...searchParams, color: option.value })}
                      className={`w-10 h-10 rounded-full ${
                        option.value === '하양' ? 'bg-white' :
                        option.value === '노랑' ? 'bg-yellow-400' :
                        option.value === '주황' ? 'bg-orange-500' :
                        option.value === '분홍' ? 'bg-pink-400' :
                        option.value === '빨강' ? 'bg-red-500' :
                        option.value === '갈색' ? 'bg-yellow-800' :
                        option.value === '연두' ? 'bg-lime-500' :
                        option.value === '초록' ? 'bg-green-600' :
                        option.value === '청록' ? 'bg-teal-500' :
                        'bg-gray-200'
                      } border ${
                        searchParams.color === option.value
                          ? 'border-green-500 ring-2 ring-green-300'
                          : 'border-gray-300'
                      } flex items-center justify-center mb-1`}
                    >
                      {option.label === '전체' && '전체'}
                    </button>
                    <span className="text-xs">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 제형 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제형</label>
              <select
                name="shape"
                value={searchParams.shape}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {shapeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 분할선 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">분할선</label>
              <select
                name="divisionLine"
                value={searchParams.divisionLine}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {divisionLineOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 검색 버튼 */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4">
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
              >
                식별 검색하기
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchForm;