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
        
        // Wait for menu screen or terminal
        await page.waitForSelector('#menu-screen, .lore-terminal');
        // Small additional wait to ensure novel is loaded and currentRoom is set
        await page.waitForTimeout(5000);
        
        const screenshotPath = path.resolve(__dirname, 'ai-context/images/graphics-window.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Menu screenshot saved to ${screenshotPath}`);

        // Press Enter to start Lemegeton
        await page.keyboard.press('Enter');
        
        // Wait for terminal output
        await page.waitForSelector('.lore-output-line', { timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(2000);
        
        const gameScreenshotPath = path.resolve(__dirname, 'ai-context/images/gameplay.png');
        await page.screenshot({ path: gameScreenshotPath, fullPage: true });
        console.log(`Gameplay screenshot saved to ${gameScreenshotPath}`);
    } catch (error) {
        console.error('Error taking screenshot:', error);
    } finally {
        await browser.close();
    }
})();
