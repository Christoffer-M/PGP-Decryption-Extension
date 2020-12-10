document.getElementById("htmlGrabber").addEventListener('click', () => {
    console.log("Popup DOM fully loaded and parsed");

    function modifyDOM() {
        
        //You can play with your DOM here or check URL against your regex
        if(document.body.innerHTML.includes("functionality")){
            console.log("YOU FOUND ME!")
        }
        console.log('Tab scripts:');
        console.log(document.body.innerHTML);
    }

    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
        code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (results) => {
        console.log('Popup script:')
        console.log(results[0]);
    });
});