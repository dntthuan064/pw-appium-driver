import { fs } from 'appium-support';
import * as path from 'path';
import * as os from 'os';
import * as base64 from 'base-64';

export default async function uploadFile(this: any, base64Data: string) {
  try {
    // Decode base64 data
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create a temporary file to store the data
    const tempDir = await fs.mkdirp(path.join(os.tmpdir(), 'appium-playwright-uploads'));
    const tempFile = path.join(tempDir, `upload_${Date.now()}.tmp`);
    
    // Write the data to the temporary file
    await fs.writeFile(tempFile, buffer);
    
    // Return the file path that can be used with ElementHandle.setInputFiles()
    return tempFile;
  } catch (err: any) {
    throw new Error(`Failed to upload file: ${err.message}`);
  }
} 