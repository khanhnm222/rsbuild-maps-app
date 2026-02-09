/// <reference types="@rsbuild/core/types" />
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}
