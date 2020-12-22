const electron = require('electron')
const { ipcMain } = require('electron')
const puppeteer = require('puppeteer-core')
const os = require('os');
const platform = os.platform();

var options     = {
  headless: false,
  defaultViewport: null,
  args: [
//	'--start-maximized',
	'--ignoreHTTPSErrors', //to really tick "Citation indexes"
	'--window-size=1366,768'
  ],
}

if(platform == "linux"){
    options.executablePath = "/usr/bin/google-chrome"
}else if(platform == "darwin"){
    options.executablePath = "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
} else if(platform == "win32"){
	options.executablePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
}
const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
	  nativeWindowOpen: true,
	  enableRemoteModule: true,
	  worldSafeExecuteJavaScript: true 
    }
  })
// win.webContents.openDevTools();

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)
var browser = null
var linkSearch = null  
var	firstSearch = false // tick SCI, SSCI, AHCI once a Chrome session
var pages = null
var page = null
var disconnected = false
const selectorBox = '#advancedSearchInputArea' // for WOS Beta
const searchButton = 'body > app-wos > div.fix-ie-min-height > div > main > div > app-input-route > app-search-home > div.advanced-search-form > div > app-input-route > app-search-advanced > app-advanced-search-form > form > div.upper-search-preview-holder > div.query-adv-search-row.search-preview-holder > div > button.mat-focus-indicator.cdx-but-md.search.uppercase-button.mat-flat-button.mat-button-base.mat-primary'  // for WOS Beta
const noRecordsMessage = '.search-error' // for WOS Beta
const backToPrevious='#backToSearch' // for WOS Beta
const backToSearch = 'backToSearch'
const wosurl = 'https://www.webofscience.com/wos/woscc/advanced-search'
const advurl = 'https://www.webofscience.com/wos/woscc/advanced-search'
//const title ='a[title="Use Advanced Search to Narrow Your Search to Specific Criteria"]'
const title = 'a[title="Web of Science Beta"]' // for WOS Beta
const moreOptionsButton='body > app-wos > div.fix-ie-min-height > div > main > div > app-input-route > app-search-home > div.advanced-search-form > div > app-input-route > app-search-advanced > app-advanced-search-form > form > button'
const optionsMat='body > app-wos > div.fix-ie-min-height > div > main > div > app-input-route > app-search-home > div.advanced-search-form > div > app-input-route > app-search-advanced > app-advanced-search-form > form > div.moreOptions.ng-star-inserted > app-autocomplete-search-input > div > div'
const matList='#mat-chip-list-0 > div > mat-placeholder'
const moreOptionsSelector = '#mat-chip-list-input-0'
const selectSSCI='#mat-option-0 > span'
const selectAHCI='#mat-option-1 > span'
const selectSCIE='#mat-option-5 > span'
const welcomeSelector='._pendo-step-container-styles'
const welcomeCloseButton='._pendo-close-guide'
const guideSelector='#pendo-guide-container'
const guideCloseButton='._pendo-close-guide'

ipcMain.handle('makeSearch', async (event, advtext) => {
if (advtext =='') {return;}
const queryText=advtext; // important to be able to paste instead of typing !!! 
try {
  (async () => {
	  if (browser == null || disconnected == true) {
	browser = await puppeteer.launch(options)
	disconnected = false // to prevent opening a new window for each query
	firstSearch = true // to tick SCI, SSCI, and AHCI again
	pages = await browser.pages()
	page = pages[0]

//	await page.setViewport({ width: 1366, height: 768 })
	browser.on('disconnected',async()=>{
    disconnected = true;
    })

	}
	await page.goto(wosurl, {waitUntil: 'networkidle2'}).catch(e => {
            console.error('WOS URL unreachable!');
            process.exit(2);
        })
try {
pageTitle = await page.title() 
if (pageTitle && firstSearch) {

	firstSearch = false // don't tick // tick SCI, SSCI, AHCI anymore
	// show indexes
	await page.waitForSelector(moreOptionsButton);   
	await page.click(moreOptionsButton); 
// Click SSCI
	await page.waitForSelector(optionsMat);   
	await page.click(matList);
	await page.waitForSelector(selectSSCI)
	await page.click(selectSSCI);
// Click AHCI
	await page.waitForSelector(moreOptionsSelector);   
	await page.click(moreOptionsSelector);
	await page.waitForSelector(selectAHCI)
	await page.click(selectAHCI);
// Click SSCIE
	await page.waitForSelector(moreOptionsSelector);   
	await page.click(moreOptionsSelector);
	await page.waitForSelector(selectSCIE)
	await page.click(selectSCIE);
	
	}
} catch (err) {
  console.error(err.message)
}

if (pageTitle)    {
	await page.waitForSelector(selectorBox);
	await page.evaluate(selectorBox => {document.querySelector(selectorBox).value = "";}, selectorBox); // clear text area
	await page.$eval(selectorBox, (el,value) => el.value = value, queryText);
	await page.type(selectorBox, '.')
	await page.click(searchButton)
	await page.waitForNavigation({waitUntil: 'networkidle2'});
	}
try {
helpModal = await page.waitForSelector(welcomeSelector) 
if (helpModal)    {
	await page.waitForSelector(welcomeCloseButton)
	await page.click(welcomeCloseButton);
	}
} catch (err) {
  console.error(err.message)
}
try {
guideModal = await page.waitForSelector(guideSelector)
if (guideModal)    {
	await page.waitForSelector(guideCloseButton)
	await page.click(guideCloseButton);
	}
} catch (err) {
  console.error(err.message)
}


  })()
} catch (err) {
  console.error(err.message)
}

})
