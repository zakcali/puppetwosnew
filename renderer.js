var Papa = require('papaparse');
const { ipcRenderer } = require('electron')
var queryT = [];
var academics = [[],[]];
var rid; // researcherId
var orcid; // ORCID
const myUni = ' AND AD=(baskent univ)'
const depList = document.querySelector ('#selectDepartment');
const acadList = document.querySelector ('#selectAcademician');
const clearBtn = document.querySelector ('#deleteAcad');
const wosBtn = document.querySelector ('#gotoWOS');
const advText= document.querySelector('#advSearch');
depList.addEventListener('change', () => {
copyQueryText(depList.options[depList.selectedIndex].value);
});
acadList.addEventListener('change', () => {
copyAcademician()
});
clearBtn.addEventListener('click', () => {
clearAcademician()
});
wosBtn.addEventListener('click', async () => {
const ipcresult = await ipcRenderer.invoke('makeSearch', advText.value); 

});

function copyQueryText(chosen) {
	var i= Number (chosen);
	advText.value=queryT[i];
}

function copyAcademician() {
// check if only university addressed publications of an academician to be searched
var checkBox = document.querySelector('#exclusiveUni'); 
for (var i=0;i<academics.length;i++) {
let acad = academics[i][2] + " "+ academics[i][3] + ", " + academics[i][4] + ", " + academics[i][5];
		if (acad == acadList.value) 		
		{ currentAcad = i;
		rid = academics[i][7];
		orcid = academics[i][9];
		if (rid == '' && orcid == '') {
		advText.value = '' // delete previous query if exists
		break;	}
		else if (rid != '' && orcid =='')  // if there is an researchId
			ridQuery='(AI='+rid+')'
		else if (rid == '' && orcid != '')  // if there is an orcid
			ridQuery='(AI='+orcid+')'
		else if (rid != '' && orcid != '')  // if there are both researchId and orcid
			ridQuery='(AI='+orcid+ ' OR AI='+rid+')'
			
		if (checkBox.checked == true){
			ridQuery=ridQuery+myUni;
					} 
			advText.value = ridQuery; 
			
		break; }
		}
}

function clearAcademician() {
	acadList.value = "";
	acadList.focus();
}


window.onload = async function() { 
	
let csvurl= 'http://xxx.yyy.edu/zzz/department-list.csv'; // from server
let response = await fetch (csvurl);
let depCSV = await response.text();
let results = Papa.parse(depCSV, {	//parse from csv text
	skipEmptyLines: true
});
var selectList = depList;
 for (var i = 0; i < results.data.length; i++) {
	if (results.data[i][0] != 'Department') { // Papa sometimes skips first (header) row, sometimes not, be sure to skip !
		var option = document.createElement("option");
		option.value = i; 
		option.text = results.data[i][0]; // department name
		selectList.appendChild(option); 
		queryT[i] = results.data[i][1]; // query text
			}
		}
csvurl= 'http://xxx.yyy.edu/zzz/author-list.csv'; // from server
response = await fetch (csvurl);
academicsCSV = await response.text();
academicResults = Papa.parse(academicsCSV, {	//parse from csv text
	skipEmptyLines: true
});
academics = academicResults.data; // Merkez
var aacadList = document.querySelector ('#academicians');		// doesn't accept acadList, I don't know why??
for (let i = 0; i < academics.length; i++) {
		if (academicResults.data[i][0] != 'Merkez' && academicResults.data[i][0] != 'City') { // Papa sometimes skips first (header) row, sometimes not, be sure to skip !
		let option = document.createElement("option");
		option.value = academics[i][2] + " "+ academics[i][3] + ", " + academics[i][4] + ", " + academics[i][5]; // ad, soyad, ABD, BD
		aacadList.appendChild(option); 
		}
	}
wosBtn.disabled=false;
} // end of window.onload
