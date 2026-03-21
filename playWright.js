const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({
        args: ['--disable-web-security', '--allow-file-access-from-files']
    });
    const page = await browser.newPage();
    
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        console.log(`BROWSER ${type.toUpperCase()}:`, text);
    });
    
    page.on('pageerror', err => {
        console.log('BROWSER EXCEPTION:', err.message);
    });
    
    // Set viewport size for a consistent screenshot

    await page.setViewportSize({ width: 1280, height: 720 });

    const filePath = 'http://localhost:3000';
    
    try {
        await page.goto(filePath, { waitUntil: 'networkidle' });
        
        // Wait for menu screen or terminal
        await page.waitForSelector('#menu-screen:not(.hidden)');
        // Small additional wait to ensure novel is loaded and currentRoom is set
        await page.waitForTimeout(10000);
        
        const screenshotPath = path.resolve(__dirname, 'ai-context/images/graphics-window.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Menu screenshot saved to ${screenshotPath}`);

        // Press Enter to start Lemegeton
        await page.keyboard.press('Enter');

        // Wait for terminal output (increased timeout for long intro)
        await page.waitForSelector('.lore-output-line', { timeout: 60000 }).catch(() => {});
        
        // Wait for session code to appear (after intro)
        await page.waitForFunction(() => {
            const el = document.getElementById('session-code');
            return el && el.textContent !== '------';
        }, { timeout: 60000 }).catch(() => console.log("Session code didn't appear in time"));

        await page.waitForTimeout(15000);

        // Type 'look' to see the world
        await page.keyboard.type('look');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(5000);
        
        const gameScreenshotPath = path.resolve(__dirname, 'ai-context/images/gameplay.png');
        await page.screenshot({ path: gameScreenshotPath, fullPage: true });
        console.log(`Gameplay screenshot saved to ${gameScreenshotPath}`);

    } catch (error) {
        console.error('Error taking screenshot:', error);
    } finally {
        await browser.close();
    }
})();
