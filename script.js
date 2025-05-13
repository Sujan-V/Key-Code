const container = document.getElementById("keyContainer");
const keyHistory = document.getElementById("keyHistory");
const themeSwitcher = document.getElementById("themeSwitcher");
const downloadBtn = document.getElementById("downloadBtn");

const speak = (text) => {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  synth.speak(utter);
};

const categorizeKey = (key) => {
  if (/^[a-z]$/i.test(key)) return "Alphabet";
  if (/^[0-9]$/.test(key)) return "Number";
  if (/^[!@#$%^&*()_+{}\[\]:;"'<>,.?\\|`~\-=/]$/.test(key)) return "Special Character";
  if (key === " ") return "Space";
  if (["Enter", "Escape", "Backspace", "Tab", "Shift", "Control", "Alt", "CapsLock", "Meta"].includes(key))
    return "Modifier Key";
  if (/^Arrow/.test(key)) return "Arrow Key";
  if (key.length === 1 && !key.match(/[a-z0-9]/i)) return "Special Character";
  return "Other";
};

const generateHTML = (key, code, keyCode, shift, ctrl, alt) => {
  const timestamp = new Date().toLocaleTimeString();
  const category = categorizeKey(key);
  const displayKey = key === " " ? "Space" : key;

  return `
    <div class="key-container">
        <div class="key-title">Key</div>
        <div class="key-content">${displayKey}</div>
        <button class="copy-btn" onclick="copyText('${displayKey}')">Copy</button>
    </div>

    <div class="key-container">
        <div class="key-title">Code</div>
        <div class="key-content">${code}</div>
        <button class="copy-btn" onclick="copyText('${code}')">Copy</button>
    </div>

    <div class="key-container">
        <div class="key-title">Key Code</div>
        <div class="key-content">${keyCode}</div>
        <button class="copy-btn" onclick="copyText('${keyCode}')">Copy</button>
    </div>

    <div class="key-container">
        <div class="key-title">Category</div>
        <div class="key-content">${category}</div>
    </div>

    <div class="key-container">
        <div class="key-title">Modifiers</div>
        <div class="key-content">
            ${shift ? "Shift " : ""}${ctrl ? "Ctrl " : ""}${alt ? "Alt " : ""}${!shift && !ctrl && !alt ? "None" : ""}
        </div>
    </div>

    <div class="key-container">
        <div class="key-title">Time</div>
        <div class="key-content">${timestamp}</div>
    </div>

    <div class="key-container">
        <div class="key-title">Raw Info</div>
        <div class="key-content">key: "${key}", code: "${code}"</div>
    </div>
  `;
};

const copyText = (text) => {
  navigator.clipboard.writeText(text).then(() => alert(`Copied: ${text}`));
};

window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "k") {
    alert("🎉 Easter Egg Found!");
  }

  container.innerHTML = generateHTML(e.key, e.code, e.key.charCodeAt(0), e.shiftKey, e.ctrlKey, e.altKey);

  const time = new Date().toLocaleTimeString();
  const displayKey = e.key === " " ? "Space" : e.key;

  const li = document.createElement("li");
  li.textContent = `[${time}] ${displayKey} → ${e.code} (${e.key.charCodeAt(0)}) ${e.shiftKey ? "[Shift]" : ""}`;
  keyHistory.prepend(li);

  if (navigator.vibrate) navigator.vibrate(50);

  speak(displayKey);
});

themeSwitcher.addEventListener("change", () => {
  document.body.classList.toggle("light");
});

downloadBtn.addEventListener("click", () => {
  const items = document.querySelectorAll("#keyHistory li");
  if (items.length === 0) {
    alert("No key history to download.");
    return;
  }

  let text = "Key History Log:\n\n";
  items.forEach((li) => {
    text += li.textContent + "\n";
  });

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "key-history.txt";
  a.click();
  URL.revokeObjectURL(url);
});
