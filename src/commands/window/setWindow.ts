export default async function setWindow(this: any, handle: string) {
  if (!this.windows[handle]) {
    throw new Error(`Window handle not found: ${handle}`);
  }
  
  this.currentHandle = handle;
} 