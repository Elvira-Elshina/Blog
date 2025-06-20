import React from 'react';
import { Alert } from 'antd';

interface ErrorIndicatorProps {
  error: string | null | undefined;
}

export const ErrorIndicator: React.FC<ErrorIndicatorProps> = ({ error }) => {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Alert
        message="Ошибка"
        description={error || 'Произошла неизвестная ошибка'}
        type="error"
        showIcon
      />
    </div>
  );
}; 