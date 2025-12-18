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
function getPosts() {
  const postsDir = path.join(__dirname, "posts");

  return fs.readdirSync(postsDir).map(file => {
    const content = fs.readFileSync(path.join(postsDir, file), "utf-8");

    const title =
      content.match(/^# (.*)/)?.[1] || file.replace(".md", "");

    const description =
      content.split("\n").find(l => l && !l.startsWith("#")) || "";

    const tags =
      content.match(/<!-- tags:(.*?)-->/)?.[1]
        ?.split(",")
        .map(t => t.trim()) || [];

    const featured = content.includes("featured: true");

    return {
      slug: file.replace(".md", ""),
      title,
      description,
      tags,
      featured,
      readTime: Math.max(1, Math.ceil(content.split(" ").length / 200)),
      content
    };
  });
}

// --------------------
// Routes
// --------------------
app.get("/", (req, res) => {
  const q = req.query.q?.toLowerCase() || "";
  const tag = req.query.tag;

  let posts = getPosts();

  if (q) {
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q)
    );
  }

  if (tag) {
    posts = posts.filter(p => p.tags.includes(tag));
  }

  const featured = posts.filter(p => p.featured);
  const tags = [...new Set(posts.flatMap(p => p.tags))];

  res.render("index", {
    posts,
    featured,
    tags,
    q
  });
});

// 🔥 THIS IS THE IMPORTANT FIX
app.get("/post/:slug", (req, res) => {
  const filePath = path.join(__dirname, "posts", `${req.params.slug}.md`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Post not found");
  }

  const markdown = fs.readFileSync(filePath, "utf-8");

  const post = {
    title: markdown.match(/^# (.*)/)?.[1] || "Untitled",
    html: marked.parse(markdown)
  };

  // ✅ post IS NOW PASSED CORRECTLY
  res.render("post", { post });
});

// --------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
