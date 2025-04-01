export default async function getWindowHandle(this: any) {
  if (!this.currentHandle) {
    throw new Error('No current window handle available');
  }
  
  return this.currentHandle;
} 