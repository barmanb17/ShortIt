import { readFile } from 'fs/promises';
import { createServer } from 'http';
import crypto from "crypto";
import path from 'path';
import { writeFile } from 'fs/promises';
import express from "express";

const app = express();


const PORT = 3000;
const DATA_FILE = path.join("data", "links.json");

app.use(express.static("public"));

const serveFile = async (res, filePath, contentType) => {
    try {
        const data = await readFile(filePath);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    } catch (error) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 page not found");
    }
};

const loadLinks = async () =>{
    try {
        const data = await readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);

    } catch (error) {
        if(error.code === "ENOENT"){
            await writeFile(DATA_FILE, JSON.stringify({}))
            return{};
        }
        throw error;
    }
}

const saveLinks = async (links) =>{
    await writeFile(DATA_FILE, JSON.stringify(links));
}

app.get("/", async(req, res) => {
    try {
        const file = await fstat.readFile(path.join("views", "index.html"));
        const links = await loadLinks();

        const content = file.toString().replaceAll("{{shortened_urls}}", )
    } catch (error) {
        console.error(err);
        return res.status(500).send("internal server error");
    }
})

app.post("/", async (req, res) => {
    try {
        const {url, shortCode} = req.body;
        const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");
        if(links[finalShortCode]) {
            return res.send(400).send("Short code already exists. Please choose another.");
        }
            links[finalShortCode] = url;
            await saveLinks(links);
    } catch (error) {
        
    }
})

const server = createServer(async (req, res) => {
    if (req.method === "GET") {
        if (req.url === "/") {
            return serveFile(res, path.join("public", "index.html"), "text/html");
        } 
        else if (req.url === "/style.css") {
            return serveFile(res, path.join("public", "style.css"), "text/css");
        }else if (req.url === "/links"){
            const links = await loadLinks();

            res.writeHead(200, {"Content-Type": "application/json"});
            return res.end(JSON.stringify(links));
        } else {
            const links = await loadLinks();
            const shortCode = req.url.slice(1);
            console.log("links red.", req.url);
            if(links[shortCode]){
                res.writeHead(302, {location : links[shortCode] });
                return res.end();
            }

            res.writeHead(404, {"Content-Type": "text/plain"});
                return res.end("Shortened URL is not found");

        }
    }



    // ✅ Only run 404 if no valid route matched
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 page not found");
});


server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
