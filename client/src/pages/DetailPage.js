// client/src/pages/DetailPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { medicationAPI, userMedicationAPI } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToMyMeds, setAddingToMyMeds] = useState(false);
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  // 아코디언 상태 관리
  const [expandedSections, setExpandedSections] = useState({
    ingredients: false,
    effects: false,
    dosage: false,
    precautions: false,
    expertPrecautions: false
  });

  // 의약품 상세 정보 불러오기
  useEffect(() => {
    const fetchMedicationDetail = async () => {
      try {
        setLoading(true);
        const response = await medicationAPI.getById(id);
        setMedication(response.data);
      } catch (err) {
        setError('의약품 정보를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicationDetail();
  }, [id]);

  // 섹션 토글 핸들러
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 내 의약품에 추가
  const handleAddToMyMedications = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/medications/${id}` } });
      return;
    }

    try {
      setAddingToMyMeds(true);
      await userMedicationAPI.addMedication({
        medicationId: id,
        notes: '',
        intakeTime: ''
      });
      
      setShowAddSuccess(true);
      setTimeout(() => setShowAddSuccess(false), 3000);
    } catch (err) {
      setError('의약품을 내 목록에 추가하는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setAddingToMyMeds(false);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-3 text-gray-600">의약품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !medication) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || '의약품 정보를 찾을 수 없습니다.'}</p>
        </div>
        <div className="mt-4">
          <Link to="/search" className="text-green-600 hover:text-green-800">
            &larr; 검색 페이지로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 의약품 정보 표시
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 상단 내비게이션 */}
      <div className="mb-6">
        <Link to="/search" className="text-green-600 hover:text-green-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          검색 결과로 돌아가기
        </Link>
      </div>

      {/* 성공 메시지 */}
      {showAddSuccess && (
        <div className="fixed top-16 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>내 의약품에 추가되었습니다.</span>
          </div>
        </div>
      )}

      {/* 의약품 기본 정보 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          {/* 의약품 이미지 */}
          <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-6">
            <img
              src={medication.imageUrl || '/assets/pill-placeholder.png'}
              alt={medication.koreanName}
              className="max-h-64 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/pill-placeholder.png';
              }}
            />
          </div>
          
          {/* 의약품 기본 정보 */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{medication.koreanName}</h1>
            {medication.englishName && (
              <p className="text-gray-600 mb-4">{medication.englishName}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {medication.classification && (
                <div>
                  <span className="text-gray-500 text-sm">분류</span>
                  <p className="font-medium">{medication.classification}</p>
                </div>
              )}
              
              {medication.company && (
                <div>
                  <span className="text-gray-500 text-sm">제조/수입사</span>
                  <p className="font-medium">{medication.company}</p>
                </div>
              )}
              
              {medication.formulation && (
                <div>
                  <span className="text-gray-500 text-sm">제형</span>
                  <p className="font-medium">{medication.formulation}</p>
                </div>
              )}
              
              {medication.appearance && (
                <div>
                  <span className="text-gray-500 text-sm">성상</span>
                  <p className="font-medium">{medication.appearance}</p>
                </div>
              )}
              
              {medication.color && (
                <div>
                  <span className="text-gray-500 text-sm">색상</span>
                  <p className="font-medium">{medication.color}</p>
                </div>
              )}
              
              {medication.shape && (
                <div>
                  <span className="text-gray-500 text-sm">모양</span>
                  <p className="font-medium">{medication.shape}</p>
                </div>
              )}
              
              {medication.divisionLine && (
                <div>
                  <span className="text-gray-500 text-sm">분할선</span>
                  <p className="font-medium">{medication.divisionLine}</p>
                </div>
              )}
              
              {medication.markings && (
                <div>
                  <span className="text-gray-500 text-sm">식별표기</span>
                  <p className="font-medium">{medication.markings}</p>
                </div>
              )}
            </div>
            
            {/* 내 의약품에 추가 버튼 */}
            <button
              onClick={handleAddToMyMedications}
              disabled={addingToMyMeds}
              className={`mt-4 w-full md:w-auto px-6 py-2 rounded-md text-white transition
                ${addingToMyMeds ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {addingToMyMeds ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  처리 중...
                </span>
              ) : (
                '내 의약품에 추가'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 의약품 상세 정보 (아코디언) */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="border-b">
          <button
            onClick={() => toggleSection('ingredients')}
            className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
          >
            <span className="text-lg font-medium">성분 정보</span>
            <svg
              className={`h-6 w-6 transform ${expandedSections.ingredients ? 'rotate-180' : ''} transition-transform`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.ingredients && (
            <div className="px-6 py-4">
              <p className="whitespace-pre-line">{medication.ingredients || '정보가 없습니다.'}</p>
            </div>
          )}
        </div>

        <div className="border-b">
          <button
            onClick={() => toggleSection('effects')}
            className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
          >
            <span className="text-lg font-medium">효능·효과</span>
            <svg
              className={`h-6 w-6 transform ${expandedSections.effects ? 'rotate-180' : ''} transition-transform`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.effects && (
            <div className="px-6 py-4">
              <p className="whitespace-pre-line">{medication.effects || '정보가 없습니다.'}</p>
            </div>
          )}
        </div>

        <div className="border-b">
          <button
            onClick={() => toggleSection('dosage')}
            className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
          >
            <span className="text-lg font-medium">용법·용량</span>
            <svg
              className={`h-6 w-6 transform ${expandedSections.dosage ? 'rotate-180' : ''} transition-transform`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.dosage && (
            <div className="px-6 py-4">
              <p className="whitespace-pre-line">{medication.dosage || '정보가 없습니다.'}</p>
            </div>
          )}
        </div>

        <div className="border-b">
          <button
            onClick={() => toggleSection('precautions')}
            className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
          >
            <span className="text-lg font-medium">사용상의 주의사항</span>
            <svg
              className={`h-6 w-6 transform ${expandedSections.precautions ? 'rotate-180' : ''} transition-transform`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.precautions && (
            <div className="px-6 py-4">
              <div className="max-h-96 overflow-y-auto">
                <p className="whitespace-pre-line">{medication.precautions || '정보가 없습니다.'}</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleSection('expertPrecautions')}
            className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
          >
            <span className="text-lg font-medium">전문가를 위한 정보</span>
            <svg
              className={`h-6 w-6 transform ${expandedSections.expertPrecautions ? 'rotate-180' : ''} transition-transform`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.expertPrecautions && (
            <div className="px-6 py-4">
              <div className="max-h-96 overflow-y-auto">
                <p className="whitespace-pre-line">{medication.expertPrecautions || '정보가 없습니다.'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">보관 및 사용기간</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medication.storage && (
              <div>
                <span className="text-gray-500 text-sm">저장방법</span>
                <p className="font-medium">{medication.storage}</p>
              </div>
            )}
            
            {medication.validity && (
              <div>
                <span className="text-gray-500 text-sm">사용기간</span>
                <p className="font-medium">{medication.validity}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;