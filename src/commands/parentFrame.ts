export default async function parentFrame(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error('No current window/page available');
  }
  
  try {
    // If already at top level, there's no parent frame
    if (!this.currentFrame || this.currentFrame === page.mainFrame()) {
      this.currentFrame = null;
      return null;
    }
    
    // Get the parent frame
    const parentFrame = this.currentFrame.parentFrame();
    
    // If there's no parent frame, switch to the top-level frame
    if (!parentFrame) {
      await page.mainFrame().focus();
      this.currentFrame = null;
    } else {
      await parentFrame.focus();
      this.currentFrame = parentFrame;
    }
    
    return null;
  } catch (err: any) {
    throw new Error(`Failed to switch to parent frame: ${err.message}`);
  }
} 