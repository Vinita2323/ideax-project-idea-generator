const theme = document.getElementById("theme");
const output = document.getElementById("output");
const textCopy = document.getElementById("copy");
const generate = document.getElementById("generate");
const dropdownMenu = document.getElementById("dropdown");

generate.addEventListener("click", generateContent);
theme.addEventListener("click", turntheme);
textCopy.addEventListener("click", copyTextToClipboard);
dropdownMenu.addEventListener("change", (dets) => updateTypes(dets));

// It is use to take all necessary values from frontend
function generateContent() {
  const role = document.getElementById("dropdown").value;
  const type = document.getElementById("types").value;
  const difficulty = document.getElementById("difficulty").value;
  const clear = document.getElementById("clear");

  if (role !== "role" && type !== "selector") {
    preLoaderAnimation();
    main(difficulty, role, type);
  } else alert("Please select Proper Options ");
}

function preLoaderAnimation() {
  const preloaders = document.getElementsByClassName("preloader");
  output.innerHTML = "";
  for (let preloader of preloaders) {
    if (!preloader.classList.contains("animation")) {
      preloader.classList.add("animation");
    } else {
      preloader.classList.remove("animation");
    }
  }
}

// It is used for to generate output from gemini api
async function main(difficulty, role, type) {
  const apiKey = "AIzaSyACCG5NcfGN-JGD_rNCZALLRqh5hiyrxyQ"; // Replace with your actual API key
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
Create a single ${type} project description for a ${role} with ${difficulty} difficulty. Include:

1. A unique company name with industry.
2. A creative project name.
3. A brief project description.
4. A deadline in weeks.

Ensure the output avoids symbols like asterisks (), hash marks (##), or other special characters. Just use • for formatting. Each result should be unique every time the prompt is run.
                `,
              },
            ],
          },
        ],
      }),
    });

    preLoaderAnimation();

    const data = await response.json();
    const promptAns = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    output.innerText = `${promptAns}`;
  } catch (e) {
    console.log(`Error connecting to Gemini API: ${e}`);
  }
}

// this function is for turn off dark theme or turn on dark theme
function turntheme() {
  const body = document.body;
  const bulb = body.classList.contains("dark-mode");
  if (bulb) {
    body.classList.remove("dark-mode");
    textCopy.style.filter = "invert(100%)";
  } else {
    body.classList.add("dark-mode");
    textCopy.style.filter = "invert(0%)";
  }
}

// This Function is for copy Text from page and store it to some where
function copyTextToClipboard() {
  // Copy text with proper formate to clipboard
  navigator.clipboard.writeText(output.innerText);
}
clear.addEventListener("click", () => {
  output.innerText = "Get ideas to Develop project ❌ skills ✔️";
});

// Update the types based on dropdown selection
function updateTypes(dets) {
  var types = [
    `<option value="selector" class="options" selected>Select one option</option>`,

    `<option value="selector" class="options" selected>Select one option</option>
                    <option class="options" value="logo">Logo</option>
                    <option class="options" value="poster">Poster</option>
                    <option class="options" value="billboard">Billboard</option>
                    <option class="options" value="illustrations">Illustrations</option>
                    <option class="options" value="brand identity">Brand Identity</option>`,

    `<option value="selector" class="options" selected>Select one option</option>
                    <option class="options" value="web developer">Web Developer</option>
                    <option class="options" value="AiMl">AIML</option>
                    <option class="options" value="android developer">Android Developer</option>
                    <option class="options" value="software developer">Software Developer</option>`,
  ];

  document.getElementById("types").innerHTML =
    types[dropdownMenu.selectedIndex];
}
