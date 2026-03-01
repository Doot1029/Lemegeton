const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({
        args: ['--disable-web-security', '--allow-file-access-from-files']
    });
    const page = await browser.newPage();
    
    // Set viewport size for a consistent screenshot
    await page.setViewportSize({ width: 1280, height: 720 });

    const filePath = 'file://' + path.resolve(__dirname, 'index.html');
    
    try {
        await page.goto(filePath, { waitUntil: 'networkidle' });
        
        // Wait for the game to initialize and any animations to settle
        await page.waitForTimeout(10000);
        
        const screenshotPath = path.resolve(__dirname, 'ai-context/images/graphics-window.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        console.log(`Screenshot saved to ${screenshotPath}`);
    } catch (error) {
        console.error('Error taking screenshot:', error);
    } finally {
        await browser.close();
    }
})();
