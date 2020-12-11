// $(function() {
//     $("#htmlGrabber").on('click', () => {
//         console.log("Popup DOM fully loaded and parsed");
        
//         function modifyDOM() {
//             encrypt("test");
//             const regex = /(-----BEGIN PGP MESSAGE-----(\n.*?)*)\n\s*\n*(-----END PGP MESSAGE-----)/gm;
//             //You can play with your DOM here or check URL against your regex
//             var html = document.body.getElementsByTagName("*");
//             for (let index = 0; index < html.length; index++) {
//                 var thishtml = html[index].innerHTML;
//                 if(thishtml.match(regex)){
                    
//                     thishtml = thishtml.replace(regex, "ENCRYPTED MESSAGE");
//                     html[index].innerHTML = thishtml;
//                     break;
//                 }else {
//                     console.log("YOU DIDN'T FIND ME!");
//                 }
                
//             }
//         }
    
//         //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
//         chrome.tabs.executeScript({
//             code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
//         }, (results) => {
//             console.log('Popup script:')
//             console.log(results[0]);
//         });
//         console.log("Hi there!")
//     })
// })

