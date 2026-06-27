declare namespace JSX {
  interface Element extends import('react').ReactElement<any, any> {}
  interface ElementClass extends import('react').Component<any> {}
  interface IntrinsicElements extends import('react').JSX.IntrinsicElements {}
}
