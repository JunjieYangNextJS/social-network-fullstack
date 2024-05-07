const sanitizeHtml = require('sanitize-html');
const cleanBadWord = require('./cleanBadWord');

const sanitize = content => {
  return sanitizeHtml(content, {
    allowedTags: [
      'p',
      'b',
      'i',
      'em',
      'strong',
      'a',
      'u',
      'h1',
      'h2',
      'h3',
      'h4',
      's',
      'blockquote',
      'br',
      'pre',
      'iframe',
      'sub',
      'sup',
      'ul',
      'ol',
      'img'
    ],
    allowedAttributes: {
      a: ['href', 'target', 'name'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
      iframe: [
        'class',
        'allowfullscreen',
        'frameborder',
        'src',
        'name',
        'multiple'
      ],
      p: ['class'],
      pre: ['spellcheck', 'class']
    },

    allowedIframeHostnames: [
      'www.youtube.com',
      'www.vimeo.com',
      'www.bilibili.com'
    ],
    selfClosing: [
      'img',
      'br',
      'hr',
      'area',
      'base',
      'basefont',
      'input',
      'link',
      'meta'
    ],
    // URL schemes we permit
    allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel'],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
    allowProtocolRelative: true,
    enforceHtmlBoundary: false
  });
};

const cleanSanitize = el => {
  return cleanBadWord(sanitize(el));
};

const sanitizeAllTags = el => {
  return cleanBadWord(
    sanitizeHtml(el, { allowedTags: [], allowedAttributes: {} }) ||
      '[ Image/Link ]'
  );
};

exports.array = [1, 2, 3];

module.exports = { sanitize, cleanSanitize, sanitizeAllTags };
