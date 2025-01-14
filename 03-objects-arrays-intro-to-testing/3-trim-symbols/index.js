/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) return string;
  if (size === 0) return '';
  
  let newString = '';
  let order = 0;
  let prevLetter = string[0];
  
  for (const letter of string) { 
    if (letter !== prevLetter) {
      order = 0;
      prevLetter = letter;
    }
    
    if (order < size && letter === prevLetter) {
      newString += letter;
      order++;
      continue;
    }    
  }
  
  return newString;
}

