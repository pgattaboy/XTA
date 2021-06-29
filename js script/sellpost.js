const productType = document.getElementById("product_type");
const brandModel = document.getElementById("grp1");
const oldNew = document.getElementById("cndtn");
const fullInfo = document.getElementById("des");
const nameMain = document.getElementById("name");
const authorMain = document.getElementById("author");
const majorInfo = document.getElementById("grp2");
const ticketInfo = document.getElementById("fromtodate");
const submitBtn = document.getElementById("submit");

productType.addEventListener('change',showValidOption);

function showBrandModel() {
    brandModel.setAttribute("style","display:block");
}
function notShowBrandModel() {
    brandModel.setAttribute("style","display:none");
}
function showOldNew() {
    oldNew.setAttribute("style","display:block");
}
function notShowOldNew() {
    oldNew.setAttribute("style","display:none");
}
function showFullInfo() {
    fullInfo.setAttribute("style","display:block");
}
function notShowFullInfo() {
    fullInfo.setAttribute("style","display:none");
}
function showNameMain() {
    nameMain.setAttribute("style","display:block");
}
function notShowNameMain() {
    nameMain.setAttribute("style","display:none");
}
function showAuthorMain() {
    authorMain.setAttribute("style","display:block");
}
function notShowAuthorMain() {
    authorMain.setAttribute("style","display:none");
}
function showMajorInfo() {
    majorInfo.setAttribute("style","display:block");
}
function notShowMajorInfo() {
    majorInfo.setAttribute("style","display:none");
}
function showTicketInfo() {
    ticketInfo.setAttribute("style","display:block");
}
function notShowTicketInfo() {
    ticketInfo.setAttribute("style","display:none");
}
function notShowOption() {
    notShowAuthorMain();
    notShowBrandModel();
    notShowFullInfo();
    notShowMajorInfo();
    notShowNameMain();
    notShowOldNew();
    notShowTicketInfo();
}
function showValidOption() {
    const productTypeValue = productType.value;
    submitBtn.setAttribute("style","display:block");
    notShowOption();
    if(productTypeValue === 'electronics' || productTypeValue === 'two_wheeler'){
        showBrandModel();
        showOldNew();
        showMajorInfo();
        showFullInfo();
    }
    else if(productTypeValue === 'ticket'){
        showTicketInfo();
        showNameMain();
        showMajorInfo();
    }
    else if(productTypeValue === 'book'){
        showNameMain();
        showAuthorMain();
        showOldNew();
        showFullInfo();
        showMajorInfo();
    }
    else if(productTypeValue === 'rent'){
        showFullInfo();
        showMajorInfo();
    }
    else if(productTypeValue === 'home_appliance'){
        showOldNew();
        showFullInfo();
        showMajorInfo();
    }
    else
    {
        submitBtn.setAttribute("style","display:none");
    }
}