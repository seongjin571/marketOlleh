

var test2 = document.getElementsByTagName('td');

for(var i=0; i<test2.length; i++){
	test2[i].addEventListener('click', addText, false);
}

function addText(event){
	text_inner.value += this.innerText+" / ";
}

// function navControl(event){
// 	this.hidden = true;
// 	console.log(this);
// 	console.log(this.hidden);
// }

function navControl(event){
	var booleanB = Boolean(Searching.hidden);
	Searching.hidden = !booleanB;
	Goomap.hidden = booleanB;
}

navControl();
//////////////////////addEventListener//////////////////////

document.getElementById('navControlButton').addEventListener('click', navControl, false);