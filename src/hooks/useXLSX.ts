import * as XLSX from 'xlsx';

interface ExcelToJsonType {
  [key: string]: any | undefined;
}

export function useXLSX() {
  const excelToJson = async (file?: File): Promise<ExcelToJsonType> => {
    try {
      const workbook = XLSX.read(await file?.arrayBuffer());

      const sheet_name_list = workbook.SheetNames;

      const xlData = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]],
        { defval: '', blankrows: true, raw: true }
      );

      let filteredData = xlData.map((item: any) => {
        const { __rowNum__, ...rest } = item;
        return rest;
      });

      filteredData = filteredData.filter((item: any) => {
        if (Object.values(item).every((x) => x === null || x === '')) {
          return false;
        }
        return true;
      });

      return { data: filteredData };
    } catch (error) {
      console.error(error);
      return { data: [] };
    }
  };

  return { excelToJson };
}
