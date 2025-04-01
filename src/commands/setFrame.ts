export default async function setFrame(this: any, frameId: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error('No current window/page available');
  }
  
  try {
    // Handle special cases
    if (frameId === null) {
      // Switch to the main frame (top-level document)
      await page.mainFrame().focus();
      this.currentFrame = null;
      return null;
    }
    
    // Case 1: frameId is a number (index)
    if (typeof frameId === 'number') {
      const frames = page.frames();
      if (frameId < 0 || frameId >= frames.length) {
        throw new Error(`Frame index out of bounds: ${frameId}`);
      }
      
      const frame = frames[frameId];
      await frame.focus();
      this.currentFrame = frame;
      return null;
    }
    
    // Case 2: frameId is an element reference (frame or iframe element)
    if (frameId && typeof frameId === 'object' && frameId[this.W3C_ELEMENT_KEY]) {
      const elementId = frameId[this.W3C_ELEMENT_KEY];
      const element = this.elementCache.get(elementId);
      
      if (!element) {
        throw new Error(`Element with id ${elementId} not found in cache`);
      }
      
      // Get frame by element handle
      const frameHandle = await element.contentFrame();
      if (!frameHandle) {
        throw new Error('The element is not a frame or an iframe');
      }
      
      await frameHandle.focus();
      this.currentFrame = frameHandle;
      return null;
    }
    
    // Case 3: frameId is a string (name or id)
    if (typeof frameId === 'string') {
      // Try to find frame by name or id
      const frames = page.frames();
      const frame = frames.find((f) => f.name() === frameId);
      
      if (!frame) {
        throw new Error(`Frame with name or id '${frameId}' not found`);
      }
      
      await frame.focus();
      this.currentFrame = frame;
      return null;
    }
    
    throw new Error(`Invalid frame reference: ${frameId}`);
  } catch (err: any) {
    throw new Error(`Failed to switch to frame: ${err.message}`);
  }
} 