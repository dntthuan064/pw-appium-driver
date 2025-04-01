export default async function getWindowHandles(this: any) {
  return Object.keys(this.windows);
} 