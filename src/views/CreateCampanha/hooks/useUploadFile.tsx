import React from 'react';
import { useXLSX } from '../../../hooks/useXLSX';
import { phoneRegex } from '../schemas/campaignSchema';
import Swal from 'sweetalert2';
import { addBrazilianCountryCode } from '../../../utils/phoneNumbers';

type Props = {
  setContactsObject: (props: any[]) => void;
  setContactKey: (props: string) => void;
  setValue: (key: any, props: any) => void;
  trigger: (key: any) => void;
};

export default function useUploadFile({
  setContactsObject,
  setContactKey,
  setValue,
  trigger,
}: Props) {
  const { excelToJson } = useXLSX();

  async function handleUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const { data } = await excelToJson(e.target.files?.[0]);
    const key = Object.keys(data[0]).find((item) => {
      return phoneRegex.test(data[0][item].replace(/[^0-9]/gi, ''));
    });

    if (!key) {
      Swal.fire(
        'Erro',
        'A planilha deve ter ao menos uma coluna que contenha números de telefone	válidos',
        'warning'
      );
      return;
    }

    const formattedDate = data.map((item: any) => ({
      ...item,
      [key!]: addBrazilianCountryCode(item?.[key!]),
    }));

    const formattedContacts = formattedDate.map((item: any) => ({
      contact: item?.[key!],
      variables: JSON.stringify(item),
    }));

    setContactsObject(formattedDate);
    setContactKey(key);
    setValue('contacts', formattedContacts);
    setValue('variables', Object.keys(data[0]));
    setValue('fileName', e.target.files?.[0].name);
    trigger('variables');
    e.target.value = '';
  }

  return { handleUploadFile };
}
