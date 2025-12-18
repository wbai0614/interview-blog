const express = require("express");
const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

const app = express();
const PORT = process.env.PORT || 8080;

// --------------------
// App setup
// --------------------
app.set("view engine", "ejs");
app.use(express.static("public"));

// --------------------
// Helpers
// --------------------

// Parse frontmatter metadata from Markdown
function parseFrontmatter(content) {
  const meta = {
    title: null,
    tags: [],
    description: "",
    featured: false
  };

  const match = content.match(/<!--([\s\S]*?)-->/);
  if (!match) return meta;

  match[1].split("\n").forEach(line => {
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) return;

    const value = rest.join(":").trim();

    switch (key.trim().toLowerCase()) {
      case "title":
        meta.title = value;
        break;
      case "tags":
        meta.tags = value.split(",").map(t => t.trim());
        break;
      case "description":
        meta.description = value;
        break;
      case "featured":
        meta.featured = value.toLowerCase() === "true";
        break;
    }
  });

  return meta;
}

// Estimate reading time
function readingTime(text) {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// Get excerpt for index page
function getExcerpt(content) {
  const lines = content.split("\n");
  // Skip frontmatter
  const firstContentLine = lines.findIndex(l => !l.startsWith("<!--") && l.trim() !== "");
  return marked.parse(lines.slice(firstContentLine, firstContentLine + 5).join("\n"));
}

// Read all posts
function getPosts() {
  const postsDir = path.join(__dirname, "posts");

  return fs.readdirSync(postsDir)
    .filter(f => f.endsWith(".md"))
    .map(file => {
      const content = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const meta = parseFrontmatter(content);

      // Title fallback: frontmatter > first H1 > slug
      const title =
        meta.title ||
        content.match(/^# (.*)/m)?.[1] ||
        file.replace(".md", "").replace(/-/g, " ");

      return {
        slug: file.replace(".md", ""),
        title,
        excerpt: getExcerpt(content),
        tags: meta.tags,
        description: meta.description || "",
        featured: meta.featured,
        readTime: readingTime(content),
        content
      };
    });
}

// --------------------
// Routes
// --------------------

// Homepage
app.get("/", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const tag = req.query.tag;

  let posts = getPosts();

  if (q) {
    posts = posts.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (tag) {
    posts = posts.filter(p => p.tags.includes(tag));
  }

  const featured = posts.filter(p => p.featured);
  const tags = [...new Set(posts.flatMap(p => p.tags))];

  res.render("index", { posts, featured, tags, q });
});

// Individual post page
app.get("/post/:slug", (req, res) => {
  const filePath = path.join(__dirname, "posts", `${req.params.slug}.md`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Post not found");
  }

  const markdown = fs.readFileSync(filePath, "utf-8");
  const meta = parseFrontmatter(markdown);

  // Title priority: frontmatter > first H1 > slug
  const title =
    meta.title ||
    markdown.match(/^# (.*)/m)?.[1] ||
    req.params.slug.replace(/-/g, " ");

  const post = {
    title,
    html: marked.parse(markdown)
  };

  res.render("post", { post });
});

// --------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
