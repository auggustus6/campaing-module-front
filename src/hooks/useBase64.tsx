import React, { useState } from 'react';

export default function useBase64() {
  const [base64, setBase64] = useState<string>('');

  function getBase64(file: File | undefined) {
    if (!file) return;

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setBase64(reader.result as string);
    };
    reader.onerror = function (error) {
      
    };
  }
  return { base64, getBase64 };
}
