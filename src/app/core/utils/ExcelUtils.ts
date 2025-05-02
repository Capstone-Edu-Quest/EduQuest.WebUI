/** @format */

import * as XLSX from 'xlsx';

export const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const exportExcel = (data: any, nameSheet: string, nameFile: string) => {
  return new Promise((resolve, reject) => {
    let wb = XLSX.utils.book_new();

    let ws = XLSX.utils.json_to_sheet(data);
    // let ws2 = data2 !== undefined && XLSX.utils.json_to_sheet(data2);
    // let ws3 = data3 !== undefined && XLSX.utils.json_to_sheet(data3);

    XLSX.utils.book_append_sheet(wb, ws, nameSheet);
    // nameSheet2 !== undefined && XLSX.utils.book_append_sheet(wb, ws2, nameSheet2);
    // nameSheet3 !== undefined && XLSX.utils.book_append_sheet(wb, ws3, nameSheet3);

    XLSX.writeFile(wb, `${nameFile}.xlsx`);
    resolve('ok');
  });
};

export const readExcelFile = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    if (fileExtension !== 'xlsx') {
      reject(new Error('Invalid file format. Only .xlsx files are supported.'));
      return;
    }

    const reader = new FileReader();

    // On successful read
    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          reject(new Error('Failed to read the file'));
          return;
        }

        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Read the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert the worksheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    // Handle errors during file reading
    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };

    // Read the file as binary string
    reader.readAsBinaryString(file);
  });
};
