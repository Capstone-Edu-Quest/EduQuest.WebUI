export function CastJson(jsonString: string) {
  try {
    const parsed = JSON.parse(jsonString); // Parse the JSON string
    return parsed;
  } catch (e) {
    return jsonString;
  }
}

export function convertToObjectOrArray(str: string) {
  // First, remove unnecessary whitespace
  const trimmedStr = str.trim();

  // Check if it's an object-like string (starts with { and ends with })
  if (trimmedStr.startsWith('{') && trimmedStr.endsWith('}')) {
    // Manually fix the keys (add quotes around unquoted keys)
    const correctedStr = trimmedStr.replace(/([{\s,])(\w+)(:)/g, '$1"$2"$3');
    try {
      const obj = JSON.parse(correctedStr); // Try parsing as JSON
      return obj;
    } catch (e) {
      console.error('Invalid object format');
      return null;
    }
  }
  // Check if it's an array-like string (starts with [ and ends with ])
  else if (trimmedStr.startsWith('[') && trimmedStr.endsWith(']')) {
    try {
      const arr = JSON.parse(trimmedStr); // Try parsing as JSON
      return arr;
    } catch (e) {
      console.error('Invalid array format');
      return null;
    }
  }
  // Otherwise, just return the original string
  else {
    return str;
  }
}

export function deepEqual(value1: any, value2: any) {
  // Check if both values are strictly equal
  if (value1 === value2) {
    return true;
  }

  // Check if either is null or undefined
  if (value1 === null || value2 === null) {
    return false;
  }

  // Check if the types are different (not the same object type)
  if (typeof value1 !== typeof value2) {
    return false;
  }

  // If the values are arrays
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) {
      return false; // If lengths are different, they are not equal
    }

    // Recursively compare array elements
    for (let i = 0; i < value1.length; i++) {
      if (!deepEqual(value1[i], value2[i])) {
        return false;
      }
    }
    return true; // Arrays are equal
  }

  // If the values are objects
  if (typeof value1 === 'object' && typeof value2 === 'object') {
    const keys1 = Object.keys(value1);
    const keys2 = Object.keys(value2);

    // Check if the objects have the same number of keys
    if (keys1.length !== keys2.length) {
      return false;
    }

    // Recursively compare each key-value pair
    for (let key of keys1) {
      if (!keys2.includes(key) || !deepEqual(value1[key], value2[key])) {
        return false;
      }
    }
    return true; // Objects are equal
  }

  // For primitive values (numbers, strings, etc.)
  return false;
}

export const onConvertObjectToQueryParams = (obj: object) => {
  const searchParamsString = [];
  for (const key in obj) {
    searchParamsString.push(`${key}=${obj[key as keyof typeof obj]}`);
  }

  return '?' + searchParamsString.join('&');
};

export function autoMapObject<T extends object, U extends Partial<T>>(source: T, reference: U): U {
  const target = {} as U;

  Object.keys(reference).forEach((key) => {
    if (key in source) {
      (target as any)[key] = (source as any)[key]; // Safe casting
    }
  });

  return target;
}

export const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => {
        // console.log('Copied to clipboard:', text);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      // console.log('Fallback: Copying was ' + (successful ? 'successful' : 'unsuccessful'));
    } catch (err) {
      console.error('Fallback: Unable to copy', err);
    }

    document.body.removeChild(textarea);
  }
}
