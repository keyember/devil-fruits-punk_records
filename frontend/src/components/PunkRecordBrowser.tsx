import React, { useState } from 'react';
import { PunkRecord } from '../../api/punk-records';
import { PaginationBar } from './PaginationBar';
import { PunkRecordImage } from './PunkRecordImage';

interface PunkRecordBrowserProps {
  records: PunkRecord[];
  itemsPerPage?: number;
}

const ITEMS_PER_PAGE_DEFAULT = 12;

export const PunkRecordBrowser: React.FC<PunkRecordBrowserProps> = ({
  records,
  itemsPerPage = ITEMS_PER_PAGE_DEFAULT,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(records.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = records.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="punk-record-browser">
      <div className="punk-record-grid">
        {currentRecords.map((record) => (
          <div key={record.id} className="punk-record-card">
            <div className="punk-record-image-container">
              <PunkRecordImage
                src={record.image_url}
                alt={record.name}
                className="punk-record-image"
              />
            </div>
            <div className="punk-record-info">
              <h3 className="punk-record-name">{record.name}</h3>
              <p className="punk-record-type">{record.type}</p>
              <p className="punk-record-status">{record.status}</p>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
