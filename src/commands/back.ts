export default async function back(this: any) {
  const page = this.windows[this.currentHandle];
  await page.goBack();
} 