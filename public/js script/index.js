const productType = document.getElementById("product_type");
const brandModel = document.getElementById("grp1");
const nameMain = document.getElementById("name");
const authorMain = document.getElementById("author");
const majorInfo = document.getElementById("grp2");
const ticketInfo = document.getElementById("fromtodate");

productType.addEventListener('change',showValidOption);

function showBrandModel() {
    brandModel.setAttribute("style","display:block");
}
function notShowBrandModel() {
    brandModel.setAttribute("style","display:none");
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
    notShowMajorInfo();
    notShowNameMain();
    notShowTicketInfo();
}
function showValidOption() {
    const productTypeValue = productType.value;
    console.log(productTypeValue);
    notShowOption();
    if(productTypeValue === 'electronics' || productTypeValue === 'vehicle' || productTypeValue === 'home_appliance'){
        showBrandModel();
        showMajorInfo();
    }
    else if(productTypeValue === 'ticket'){
        showTicketInfo();
        showMajorInfo();
    }
    else if(productTypeValue === 'book'){
        showNameMain();
        showAuthorMain();        
        showMajorInfo();
    }
    else if(productTypeValue === 'rent'){
        showMajorInfo();
    }
    else
    {
        submitBtn.setAttribute("style","display:none");
    }
}