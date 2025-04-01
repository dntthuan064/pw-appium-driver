export default async function getTimeouts(this: any) {
  // Return the timeouts set in the driver
  return {
    script: this.timeouts.script,
    pageLoad: this.timeouts.pageLoad,
    implicit: this.timeouts.implicit
  };
} 