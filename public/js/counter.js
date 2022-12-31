const dogCounter=document.querySelector('#institute-counter')
let i=0;
var dogAdoption=setInterval(dogAdoptions,300);
function dogAdoptions(){
    i++;
    dogCounter.textContent=i;
    if(i==30)
    {
        clearInterval(dogAdoption)
        dogCounter.textContent=`${i}+`;
    }
}
const catCounter=document.querySelector('#project-counter')
let j=0;
var catAdoption=setInterval(catAdoptions,200);
function catAdoptions(){
    j++;
    catCounter.textContent=j;
    if(j==20)
    {
        clearInterval(catAdoption)
        catCounter.textContent=`${j}+`;
    }
}