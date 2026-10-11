using System;
using System.IO;
using System.Net;
using System.Threading;
using System.Collections.Generic;

class Server {
    static readonly Dictionary<string, string> MimeTypes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {
        { ".html", "text/html; charset=utf-8" },
        { ".htm",  "text/html; charset=utf-8" },
        { ".css",  "text/css; charset=utf-8" },
        { ".js",   "application/javascript; charset=utf-8" },
        { ".mjs",  "application/javascript; charset=utf-8" },
        { ".json", "application/json; charset=utf-8" },
        { ".png",  "image/png" },
        { ".jpg",  "image/jpeg" },
        { ".jpeg", "image/jpeg" },
        { ".gif",  "image/gif" },
        { ".svg",  "image/svg+xml" },
        { ".ico",  "image/x-icon" },
        { ".woff", "font/woff" },
        { ".woff2","font/woff2" },
        { ".ttf",  "font/ttf" },
        { ".eot",  "application/vnd.ms-fontobject" },
        { ".glb",  "model/gltf-binary" },
        { ".gltf", "model/gltf+json" },
        { ".exr",  "image/x-exr" },
        { ".wasm", "application/wasm" },
        { ".mp4",  "video/mp4" },
        { ".webm", "video/webm" },
        { ".ogg",  "video/ogg" }
    };

    static string RootPath = @"c:\Users\Amogh\Desktop\techweek";

    static void Main() {
        var listener = new HttpListener();
        listener.Prefixes.Add("http://localhost:8080/");
        listener.Prefixes.Add("http://127.0.0.1:8080/");
        listener.Start();
        Console.WriteLine("Server running on port 8080...");

        while (listener.IsListening) {
            try {
                var context = listener.GetContext();
                ThreadPool.QueueUserWorkItem(state => HandleRequest((HttpListenerContext)state), context);
            } catch {
                // listener stopped
            }
        }
    }

    static void HandleRequest(HttpListenerContext context) {
        var request = context.Request;
        var response = context.Response;

        try {
            string urlPath = request.Url.LocalPath.TrimStart('/');
            if (string.IsNullOrEmpty(urlPath)) {
                urlPath = "index.html";
            }
            urlPath = Uri.UnescapeDataString(urlPath);
            string filePath = Path.Combine(RootPath, urlPath.Replace('/', Path.DirectorySeparatorChar));

            if (File.Exists(filePath)) {
                string ext = Path.GetExtension(filePath);
                string contentType;
                if (!MimeTypes.TryGetValue(ext, out contentType)) {
                    contentType = "application/octet-stream";
                }

                var fileInfo = new FileInfo(filePath);
                long fileLength = fileInfo.Length;

                response.Headers["Access-Control-Allow-Origin"] = "*";
                response.Headers["Cache-Control"] = "no-cache";
                response.ContentType = contentType;

                string rangeHeader = request.Headers["Range"];
                if (!string.IsNullOrEmpty(rangeHeader) && rangeHeader.StartsWith("bytes=")) {
                    string[] parts = rangeHeader.Substring(6).Split('-');
                    long start = long.Parse(parts[0]);
                    long end = fileLength - 1;
                    if (parts.Length > 1 && !string.IsNullOrEmpty(parts[1])) {
                        end = long.Parse(parts[1]);
                    }
                    if (end >= fileLength) end = fileLength - 1;
                    long length = end - start + 1;

                    response.StatusCode = 206;
                    response.Headers["Content-Range"] = string.Format("bytes {0}-{1}/{2}", start, end, fileLength);
                    response.ContentLength64 = length;

                    using (var fs = File.OpenRead(filePath)) {
                        fs.Seek(start, SeekOrigin.Begin);
                        byte[] buffer = new byte[65536];
                        long remaining = length;
                        while (remaining > 0) {
                            int toRead = (int)Math.Min(buffer.Length, remaining);
                            int read = fs.Read(buffer, 0, toRead);
                            if (read <= 0) break;
                            response.OutputStream.Write(buffer, 0, read);
                            remaining -= read;
                        }
                    }
                } else {
                    response.StatusCode = 200;
                    response.ContentLength64 = fileLength;
                    using (var fs = File.OpenRead(filePath)) {
                        fs.CopyTo(response.OutputStream);
                    }
                }
            } else {
                response.StatusCode = 404;
                byte[] notFound = System.Text.Encoding.UTF8.GetBytes("Not found: " + urlPath);
                response.ContentLength64 = notFound.Length;
                response.OutputStream.Write(notFound, 0, notFound.Length);
            }
        } catch {
            // client aborted
        } finally {
            try { response.OutputStream.Close(); } catch {}
        }
    }
}
