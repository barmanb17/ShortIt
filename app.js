import { readFile } from 'fs/promises';
import { createServer } from 'http';
import path from 'path';

const PORT = 3000;

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

const server = createServer(async (req, res) => {
    if (req.method === "GET") {
        if (req.url === "/") {
            return serveFile(res, path.join("public", "index.html"), "text/html");
        } 
        if (req.url === "/style.css") {
            return serveFile(res, path.join("public", "style.css"), "text/css");
        }
    }
    // Fallback for unmatched routes
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 page not found");

    if(req.method === "POST" && req.url === "/shorten"){
        const body = "";
        req.on("data", (chunk) =>{
            body += chunk;
        });
        req.on('end', ()=> {
            console.log(body);
            const {url, shortCode} = JSON.parse(body);
            if(!url){
                res.writeHead(400, {"Content-Type": "text/plain"});
                return res.end("URL is required");
            }

            
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
