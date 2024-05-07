// const Filter = require('bad-words');

// const filter = new Filter();

// filter.addWords('tranny');
// filter.removeWords('god', 'butt', 'sex', 'sexy');

// const cleanBadWord = el => {
//   // return filter.clean(el) || el;

//   try {
//     return filter.clean(el);
//   } catch {
//     const joinMatch = filter.splitRegex.exec(el);
//     const joinString = (joinMatch && joinMatch[0]) || '';
//     return el
//       .split(filter.splitRegex)
//       .map(word => {
//         return filter.isProfane(word) ? filter.replaceWord(word) : word;
//       })
//       .join(joinString);
//   }
// };

const cleanBadWord = el => el;

module.exports = cleanBadWord;
