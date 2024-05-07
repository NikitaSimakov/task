import { encoded, translations } from './data.js'

// console.log("Let's rock")
// console.log(encoded, translations)



const decodeFields = (encoded, translations) => {
  const uniqueIds = [];


  const decodedItems = encoded.map(item => {
    const decodedItem = {};
    for (const key in item) {
      if (key.endsWith('Id') && !['groupId', 'service', 'formatSize', 'ca'].includes(key)) {
        const id = item[key];
        decodedItem[key.replace('Id', '')] = id !== "0" ? (translations[id] || id) : "";
        if (!uniqueIds.includes(key)) {
          uniqueIds.push(key);
        }
      } else {
        decodedItem[key] = item[key];
      }

    }
    return decodedItem;
  });

  return [decodedItems, uniqueIds];
};

const decoded = decodeFields(encoded, translations)
console.log(decoded)
