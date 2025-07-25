import createCache from '@emotion/cache';

const isBrowser = typeof document !== 'undefined';

// 在客户端，创建一个 meta 标签在文档头部
// 并将其设置为插入点。
// 这确保了 CSSBaseline 和其他 MUI 样式首先加载。
// 它允许开发者轻松覆盖 MUI 样式，例如使用 styled-components。
export default function createEmotionCache() {
  let insertionPoint;

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector(
      'meta[name="emotion-insertion-point"]',
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({ key: 'mui-style', insertionPoint });
}