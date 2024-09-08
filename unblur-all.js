//
// name: 🌫️ Unblur All
// author: Nate Levin (https://natelev.in)
// desc: Unblurs all elements on a page. Useful for getting around paywalls.
//

const style = document.createElement("style");
style.textContent = `
  * {
    filter: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
`;

document.head.appendChild(style);
