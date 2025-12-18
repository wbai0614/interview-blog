// Reading progress bar
const progressBar = document.getElementById("progress-bar");

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const progress = (scrollTop / height) * 100;
  progressBar.style.width = progress + "%";
});

// Generate TOC
const toc = document.getElementById("toc");
const headers = document.querySelectorAll(".post-content h2, .post-content h3");

headers.forEach((header, index) => {
  const id = `section-${index}`;
  header.id = id;

  const li = document.createElement("li");
  li.className = header.tagName === "H3" ? "toc-sub" : "";

  const a = document.createElement("a");
  a.href = `#${id}`;
  a.innerText = header.innerText;

  li.appendChild(a);
  toc.appendChild(li);
});
