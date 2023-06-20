export default function useTypeFromBase64(base64: string) {
  const midiaTypeFromString = base64
    ?.substring(0, 16)
    ?.split('/')[0]
    ?.split(':')[1];

  const allTypes = {
    isImage: false,
    isVideo: false,
    isAudio: false,
    isPdf: false,
    isText: false,
    isOther: false,
  };

  switch (midiaTypeFromString) {
    case 'image':
      allTypes.isImage = true;
      break;
    case 'video':
      allTypes.isVideo = true;
      break;
    case 'audio':
      allTypes.isAudio = true;
      break;
    case 'pdf':
      allTypes.isPdf = true;
      break;
    case 'text':
      allTypes.isText = true;
      break;
    default:
      allTypes.isOther = true;
      break;
  }

  return allTypes;
}
