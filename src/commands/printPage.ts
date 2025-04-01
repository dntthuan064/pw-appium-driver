export default async function printPage(this: any, options: any = {}) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error('No current window/page available');
  }
  
  try {
    // Set default print options
    const printOptions = {
      format: options.pageSize || 'Letter',
      landscape: options.orientation === 'landscape',
      margin: {
        top: options.marginTop || '0.4in',
        bottom: options.marginBottom || '0.4in',
        left: options.marginLeft || '0.4in',
        right: options.marginRight || '0.4in'
      },
      scale: options.scale || 1.0,
      printBackground: options.background !== false,
      pageRanges: options.pageRanges || ''
    };
    
    // Generate PDF
    const pdfBuffer = await page.pdf(printOptions);
    
    // Return the PDF as a base64 encoded string
    return {
      data: pdfBuffer.toString('base64')
    };
  } catch (err: any) {
    throw new Error(`Failed to print page: ${err.message}`);
  }
} 