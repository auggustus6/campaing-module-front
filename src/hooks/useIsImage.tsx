import React from 'react';

export default function useIsImage({ midiaBase64 }: { midiaBase64?: string }) {
  const isImage =
    midiaBase64?.substring(0, 16)?.split('/')[0]?.split(':')[1] === 'image';

  return { isImage };
}
