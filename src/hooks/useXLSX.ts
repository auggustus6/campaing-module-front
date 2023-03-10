import * as XLSX from 'xlsx';

interface ExcelToJsonType {
  [key: string]: any | undefined;
}

export function useXLSX() {
  const excelToJson = async (file?: File): Promise<ExcelToJsonType> => {
    try {
      const workbook = XLSX.read(await file?.arrayBuffer());
      console.log(workbook);

      const sheet_name_list = workbook.SheetNames;

      const xlData = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]],
        { defval: '', blankrows: true, raw: false }
      );

      console.log({ xlData });

      const filteredData = xlData.map((item: any) => {
        const { __rowNum__, ...rest } = item;

        return rest;
      });

      return { data: filteredData };
    } catch (error) {
      console.error(error);
      return { data: [] };
    }
  };

  return { excelToJson };
}
