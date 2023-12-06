import { useState } from 'react';
import { TABLE_CONTACTS_SIZE } from '../utils/constants';

type Props<T> = {
  data: T[];
  initialPage?: number;
  selectedFromPageIndex?: number;
};

export const usePagination = <T,>({
  data = [],
  initialPage = 0,
  selectedFromPageIndex = NaN,
}: Props<T>) => {
  const [page, setPage] = useState(initialPage);

  const dataToShow = data.slice(
    page * TABLE_CONTACTS_SIZE,
    page * TABLE_CONTACTS_SIZE + TABLE_CONTACTS_SIZE
  );

  let selectedIndexFromPage = NaN;

  if (!Number.isNaN(selectedFromPageIndex)) {
    selectedIndexFromPage = selectedFromPageIndex + page * TABLE_CONTACTS_SIZE;
  }

  return {
    dataToShow,
    page,
    setPage,
    selectedIndex: selectedIndexFromPage,
  };
};
