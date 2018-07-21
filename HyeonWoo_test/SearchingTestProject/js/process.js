

var test2 = document.getElementsByTagName('td');

for(var i=0; i<test2.length; i++){
	test2[i].addEventListener('click', addText, false);
}

function addText(event){
	text_inner.value += this.innerText+" / ";
}
