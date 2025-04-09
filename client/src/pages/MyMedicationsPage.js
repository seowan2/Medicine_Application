// client/src/pages/MyMedicationsPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { userMedicationAPI } from '../services/api';

const MyMedicationsPage = () => {
  const { currentUser } = useContext(AuthContext);
  
  const [myMedications, setMyMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [editForm, setEditForm] = useState({
    notes: '',
    intakeTime: '',
    prescription: '',
    startDate: '',
    endDate: ''
  });

  // 인증되지 않은 사용자는 로그인 페이지로 리디렉션
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: '/my-medications' }} />;
  }

  // 내 의약품 목록 불러오기
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchMyMedications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await userMedicationAPI.getMyMedications();
        setMyMedications(response.data);
      } catch (err) {
        setError('의약품 목록을 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyMedications();
  }, []);

  // 의약품 삭제 핸들러
  const handleDeleteMedication = async (medicationId) => {
    try {
      await userMedicationAPI.removeMedication(medicationId);
      
      // 성공적으로 삭제 후 목록 업데이트
      setMyMedications(prev => prev.filter(med => med.id !== medicationId));
      
      // 성공 메시지 표시
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 3000);
    } catch (err) {
      setError('의약품을 삭제하는 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  // 편집 모드 시작
  const handleStartEdit = (medication) => {
    setEditingMedication(medication.id);
    setEditForm({
      notes: medication.UserMedication?.notes || '',
      intakeTime: medication.UserMedication?.intakeTime || '',
      prescription: medication.UserMedication?.prescription || '',
      startDate: medication.UserMedication?.startDate || '',
      endDate: medication.UserMedication?.endDate || ''
    });
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setEditingMedication(null);
  };

  // 편집 폼 변경 핸들러
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 편집 저장 핸들러
  const handleSaveEdit = async (medicationId) => {
    try {
      await userMedicationAPI.addMedication({
        medicationId,
        ...editForm
      });
      
      // 성공적으로 업데이트 후 목록 갱신
      setMyMedications(prev => prev.map(med => {
        if (med.id === medicationId) {
          return {
            ...med,
            UserMedication: {
              ...med.UserMedication,
              ...editForm
            }
          };
        }
        return med;
      }));
      
      // 편집 모드 종료
      setEditingMedication(null);
    } catch (err) {
      setError('의약품 정보를 업데이트하는 중 오류가 발생했습니다.');
      console.error(err);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">내 복용약 관리</h1>
      
      {/* 성공 메시지 */}
      {showDeleteSuccess && (
        <div className="fixed top-16 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>의약품이 삭제되었습니다.</span>
          </div>
        </div>
      )}
      
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* 의약품 없음 메시지 */}
      {myMedications.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">등록된 의약품이 없습니다</h2>
          <p className="text-gray-600 mb-4">의약품 검색 페이지에서 복용 중인 약품을 추가해보세요.</p>
          <Link
            to="/search"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            의약품 검색하기
          </Link>
        </div>
      )}
      
      {/* 의약품 목록 */}
      {myMedications.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    의약품
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    복용 정보
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    복용 기간
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    처방 내용
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myMedications.map(medication => (
                  <tr key={medication.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={medication.imageUrl || '/assets/pill-placeholder.png'}
                            alt={medication.koreanName}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/pill-placeholder.png';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link to={`/medications/${medication.id}`} className="hover:text-green-600">
                              {medication.koreanName}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500">{medication.englishName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingMedication === medication.id ? (
                        <div className="space-y-2">
                          <label className="block text-xs text-gray-500">메모</label>
                          <textarea
                            name="notes"
                            value={editForm.notes}
                            onChange={handleEditFormChange}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            rows="2"
                          ></textarea>
                          
                          <label className="block text-xs text-gray-500">복용 시간</label>
                          <input
                            type="text"
                            name="intakeTime"
                            value={editForm.intakeTime}
                            onChange={handleEditFormChange}
                            placeholder="예: 아침, 점심, 저녁 식후"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-900 font-medium">
                            {medication.UserMedication?.intakeTime || '-'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {medication.UserMedication?.notes || '메모 없음'}
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingMedication === medication.id ? (
                        <div className="space-y-2">
                          <label className="block text-xs text-gray-500">시작일</label>
                          <input
                            type="date"
                            name="startDate"
                            value={editForm.startDate}
                            onChange={handleEditFormChange}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                          
                          <label className="block text-xs text-gray-500">종료일</label>
                          <input
                            type="date"
                            name="endDate"
                            value={editForm.endDate}
                            onChange={handleEditFormChange}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-900">
                            {medication.UserMedication?.startDate ? new Date(medication.UserMedication.startDate).toLocaleDateString() : '시작일 미지정'}
                          </p>
                          {medication.UserMedication?.endDate && (
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(medication.UserMedication.endDate).toLocaleDateString()} 까지
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingMedication === medication.id ? (
                        <div>
                          <label className="block text-xs text-gray-500">처방 내용</label>
                          <textarea
                            name="prescription"
                            value={editForm.prescription}
                            onChange={handleEditFormChange}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            rows="2"
                          ></textarea>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-900 line-clamp-3">
                          {medication.UserMedication?.prescription || '처방 내용 없음'}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingMedication === medication.id ? (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleSaveEdit(medication.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            저장
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleStartEdit(medication)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            편집
                          </button>
                          <button
                            onClick={() => handleDeleteMedication(medication.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMedicationsPage;