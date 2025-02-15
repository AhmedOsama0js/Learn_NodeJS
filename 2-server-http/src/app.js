const http = require("http");
const {
  addRecord,
  listRecords,
  deleteRecord,
  updateRecord,
  findOne,
} = require("./records");

const bodyData = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject("❌ Invalid JSON format");
      }
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
};

const getPrams = (url) => {
  const parts = url.split("/");
  return +parts[parts.length - 1];
};

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method === "GET" && req.url === "/api/user") {
      listRecords(res);
    } else if (req.method === "POST" && req.url === "/api/user") {
      const body = await bodyData(req);
      addRecord(body, res);
    } else if (req.method === "PUT" && req.url.startsWith("/api/user/")) {
      const id = await getPrams(req.url);
      const body = await bodyData(req);
      updateRecord(id, body, res);
    } else if (req.method === "DELETE" && req.url.startsWith("/api/user/")) {
      const id = await getPrams(req.url);
      deleteRecord(id, res);
    } else if (req.method === "GET" && req.url.startsWith("/api/user/")) {
      const id = await getPrams(req.url);
      findOne(id, res);
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: " API not found 🛑" }));
    }
  } catch (error) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: error }));
  }
});

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
