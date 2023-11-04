export function getTwoFirstLetters(name?: string) {
  const [first, second] = (name || '').split(' ');
  let text = '';
  if (!!first) text += first[0].toUpperCase();
  if (!!second) text += second[0].toUpperCase();
  return text;
}
