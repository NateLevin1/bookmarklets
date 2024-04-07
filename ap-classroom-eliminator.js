//
// name: 🚫 AP Classroom Eliminator
// author: Nate Levin (https://natelev.in)
// desc: Easily eliminate answer choices on AP Classroom
//

const answers = Array.from(document.querySelectorAll(".lrn-label"));
for (const el of answers) {
    if (el.querySelector(".eliminator")) continue;

    const btn = document.createElement("button");
    btn.style.color = "red";
    btn.style.fontSize = "1.4em";
    btn.style.height = "26px";
    btn.style.width = "26px";
    btn.style.display = "flex";
    btn.style.justifyContent = "center";
    btn.style.alignItems = "center";
    btn.textContent = "𐄂";
    btn.classList.add("eliminator");
    btn.onclick = (event) => {
        event.stopPropagation();
        if (el.style.opacity == 0.4) {
            el.style.opacity = 1;
            el.style.textDecoration = "none";
        } else {
            el.style.opacity = 0.4;
            el.style.textDecoration = "line-through";
        }
    };
    el.appendChild(btn);
}
