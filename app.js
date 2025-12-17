const express = require("express");
const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

const app = express();
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(express.static("public"));

function parseMeta(content) {
  const meta = {};
  const metaBlock = content.match(/<!--([\s\S]*?)-->/);
  if (!metaBlock) return meta;

  metaBlock[1].split("\n").forEach(line => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) {
      meta[key.trim()] = rest.join(":").trim();
    }
  });

  return meta;
}

function readingTime(text) {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function getExcerpt(content) {
  return marked(content.split("\n").slice(1, 5).join("\n"));
}

function getPosts() {
  return fs.readdirSync("./posts")
    .filter(f => f.endsWith(".md"))
    .map(file => {
      const slug = file.replace(".md", "");
      const content = fs.readFileSync(`./posts/${file}`, "utf8");
      const meta = parseMeta(content);

      return {
        slug,
        title: slug.replace(/-/g, " "),
        excerpt: getExcerpt(content),
        tags: meta.tags?.split(",").map(t => t.trim()) || [],
        description: meta.description || "",
        featured: /featured:\s*true/.test(content),
        readTime: readingTime(content)
      };
    });
}

app.get("/", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const tag = req.query.tag;

  let posts = getPosts();

  if (tag) posts = posts.filter(p => p.tags.includes(tag));
  if (q) posts = posts.filter(p =>
    p.title.includes(q) || p.description.toLowerCase().includes(q)
  );

  res.render("index", {
    featured: posts.filter(p => p.featured),
    posts: posts.filter(p => !p.featured),
    tags: [...new Set(posts.flatMap(p => p.tags))],
    q,
    tag
  });
});

app.get("/post/:slug", (req, res) => {
  const file = `./posts/${req.params.slug}.md`;
  if (!fs.existsSync(file)) return res.sendStatus(404);

  res.render("post", {
    content: marked(fs.readFileSync(file, "utf8"))
  });
});

app.listen(PORT, () => console.log(`Running on ${PORT}`));
