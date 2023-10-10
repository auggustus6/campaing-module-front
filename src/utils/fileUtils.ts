export async function fileToBase64(
  file: File | undefined
): Promise<string | undefined> {
  if (!file) return '';

  let reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result?.toString());
    };
    // reader.onerror = reject;
  });
}
