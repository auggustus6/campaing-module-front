import * as XLSX from 'xlsx';

interface ExcelToJsonType {
  [key: string]: any | undefined;
}

export function useXLSX() {
  const excelToJson = async (file?: File): Promise<ExcelToJsonType> => {
    try {
      const workbook = XLSX.read(await file?.arrayBuffer(), {
        sheetStubs: false,
        raw: true,
      });

      const sheet_name_list = workbook.SheetNames;

      const xlData = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]],
        {
          defval: '',
          rawNumbers: true,
          skipHidden: true,
          blankrows: false,
          raw: true,
        }
      );

      let filteredData = xlData.map((item: any) => {
        const { __rowNum__, ...rest } = item;
        return rest;
      });

      // convert all values to string

      filteredData = filteredData.map((item: any) => {
        const newItem: any = {};
        Object.keys(item).forEach((key) => {
          newItem[String(key).trim()] = String(item[key]).trim();
        });
        return newItem;
      });

      const firstKeys = Object.keys(filteredData[0] || {});

      for (let i = 0; i < firstKeys.length; i++) {
        let empty = true;

        for (let k = 0; k < filteredData.length; k++) {
          const element = filteredData[k];
          if (element[firstKeys[i]] !== '') {
            empty = false;
            break;
          }
        }

        if (empty) {
          filteredData = filteredData.map((item: any) => {
            const { [firstKeys[i]]: _, ...rest } = item;
            return rest;
          });
        }
      }

      // filteredData = filteredData.filter((item: any) => {
      //   if (Object.values(item).every((x) => x === null || x === '')) {
      //     return false;
      //   }
      //   return true;
      // });

      return { data: filteredData };
    } catch (error) {
      console.error(error);
      return { data: [] };
    }
  };

  return { excelToJson };
}
