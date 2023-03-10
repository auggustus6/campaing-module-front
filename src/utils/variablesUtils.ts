export function getKeysFromText(variables: string) {
  let foundVariables = [];
  let curMatch;
  const rxp = /{{([^}}]+)}/g; // an array to collect the strings that are found

  while ((curMatch = rxp.exec(variables))) {
    foundVariables.push(curMatch[1]);
  }

  return foundVariables;
}

export function getFormattedMessage({
  message,
  variables,
}: {
  message?: string;
  variables?: string;
}) {
  if (variables && message) {
    const variablesFromJson = JSON.parse(variables);

    for (let key in variablesFromJson) {
      message = message.replace(
        new RegExp('{{' + key + '}}', 'gi'),
        variablesFromJson[key]
      );
    }
  }
  return message;
}
