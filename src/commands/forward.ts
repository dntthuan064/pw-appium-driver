export default async function forward(this: any) {
  const page = this.windows[this.currentHandle];
  await page.goForward();
}
