// client/src/components/MedicationCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const MedicationCard = ({ medication }) => {
  // 모델 필드명을 사용하여 표시
  const {
    id,
    koreanName,
    englishName,
    classification,
    appearance,
    shape,
    color,
    formulation,
    imageUrl
  } = medication;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:scale-102 border border-gray-200">
      <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={koreanName}
            className="object-contain h-full w-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.parentNode.innerHTML = '<div class="text-gray-500 text-center">정보없음</div>';
            }}
          />
        ) : (
          <div className="text-gray-500 text-center">정보없음</div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{koreanName}</h3>
        <p className="text-sm text-gray-600 mb-2 truncate">{englishName || '-'}</p>
        
        <div className="text-xs text-gray-500 space-y-1 mb-3">
          {classification && <p>분류: {classification}</p>}
          {formulation && <p>제형: {formulation}</p>}
          {shape && <p>모양: {shape}</p>}
          {color && <p>색상: {color}</p>}
        </div>
        
        <Link 
          to={`/medications/${id}`}
          className="block w-full text-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition mt-2"
        >
          상세정보 보기
        </Link>
      </div>
    </div>
  );
};

export default MedicationCard;