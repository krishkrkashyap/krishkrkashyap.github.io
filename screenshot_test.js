const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();
  
  // Set viewport to something standard
  await page.setViewport({ width: 1280, height: 800 });
  
  // Listen to console logs
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));

  console.log('Navigating to http://localhost:8080...');
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
  
  console.log('Taking first screenshot (matrix)...');
  await page.screenshot({ path: 'screenshot1_matrix.png' });
  
  // Wait for 6 seconds to let the matrix finish and typewriter start
  console.log('Waiting 6 seconds...');
  await new Promise(r => setTimeout(r, 6000));
  
  console.log('Taking second screenshot (terminal)...');
  await page.screenshot({ path: 'screenshot2_terminal.png' });
  
  // Scroll down to the details
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight * 2);
  });
  
  console.log('Waiting 2 seconds for scroll animations...');
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Taking third screenshot (details)...');
  await page.screenshot({ path: 'screenshot3_details.png' });
  
  await browser.close();
  console.log('Done.');
})();
