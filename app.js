const express = require("express");
const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

const app = express();
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(express.static("public"));

// Get all Markdown posts
function getPosts() {
  const files = fs.readdirSync("./posts").filter(f => f.endsWith(".md"));
  return files.map(file => {
    const name = path.parse(file).name;  // e.g., system-design
    const slug = name;                    // exact filename without .md
    return { slug, filename: file };
  });
}

// Home page
app.get("/", (req, res) => {
  const posts = getPosts();
  res.render("index", { posts });
});

// Post page
app.get("/post/:slug", (req, res) => {
  const slug = req.params.slug;
  const filePath = path.join(__dirname, "posts", slug + ".md");
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Post not found");
  }
  const mdContent = fs.readFileSync(filePath, "utf8");
  const htmlContent = marked(mdContent);
  res.render("post", { content: htmlContent });
});

// Health check
app.get("/health", (req, res) => res.send("OK"));

// Listen on dynamic port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
