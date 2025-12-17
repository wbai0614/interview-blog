const express = require("express");
const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

const app = express();
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(express.static("public"));

// Get first 2-3 lines of Markdown as HTML
function getExcerpt(filePath, maxLines = 3) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n").filter(line => line.trim().length > 0);
  const excerptLines = lines.slice(0, maxLines).join("\n");
  return marked(excerptLines);
}

// Extract tags from frontmatter comment
function getTags(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(/<!--\s*tags:\s*(.*?)\s*-->/);
  return match && match[1] ? match[1].split(",").map(t => t.trim()) : [];
}

// Check for featured
function isFeatured(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return /featured:\s*true/.test(content);
}

// Get all posts
function getPosts() {
  const files = fs.readdirSync("./posts").filter(f => f.endsWith(".md"));
  return files.map(file => {
    const name = path.parse(file).name;
    const slug = name;
    const filePath = path.join(__dirname, "posts", file);
    return {
      slug,
      filename: file,
      excerpt: getExcerpt(filePath),
      tags: getTags(filePath),
      featured: isFeatured(filePath)
    };
  });
}

// Get unique tags
function getAllTags(posts) {
  return [...new Set(posts.flatMap(p => p.tags))];
}

// Homepage
app.get("/", (req, res) => {
  const posts = getPosts();
  const allTags = getAllTags(posts);
  const selectedTag = req.query.tag;

  const featuredPosts = posts.filter(p => p.featured && (!selectedTag || p.tags.includes(selectedTag)));
  const regularPosts = posts.filter(p => !p.featured && (!selectedTag || p.tags.includes(selectedTag)));

  res.render("index", { featuredPosts, regularPosts, allTags, selectedTag });
});

// Individual post
app.get("/post/:slug", (req, res) => {
  const slug = req.params.slug;
  const filePath = path.join(__dirname, "posts", slug + ".md");
  if (!fs.existsSync(filePath)) return res.status(404).send("Post not found");
  const mdContent = fs.readFileSync(filePath, "utf8");
  const htmlContent = marked(mdContent);
  res.render("post", { content: htmlContent });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
