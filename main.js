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
	pageTitle = await page.title() 
	if (pageTitle)    {
		await page.waitForSelector(selectorBox);
		await page.evaluate(selectorBox => {document.querySelector(selectorBox).value = "";}, selectorBox); // clear text area
		await page.$eval(selectorBox, (el,value) => el.value = value, queryText);
		await page.type(selectorBox, '.')
		await page.click(searchButton)
		await page.waitForNavigation({waitUntil: 'networkidle2'});
		
	}
  })()
} catch (err) {
  console.error(err)
}

})
