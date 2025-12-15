import * as React from 'react';

declare module 'react' {
  interface CSSProperties {
    // allow the standard hyphenated property name for compatibility
    'user-select'?: React.CSSProperties['userSelect'];
    // vendor-prefixed hyphenated forms
    '-webkit-user-select'?: React.CSSProperties['WebkitUserSelect'];
    '-moz-user-select'?: React.CSSProperties['MozUserSelect'];
    '-ms-user-select'?: React.CSSProperties['msUserSelect'];
  }
}
