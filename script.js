// Initialize Supabase Client
const SUPABASE_URL = "https://ycughbhwjsktigcjuexb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdWdoYmh3anNrdGlnY2p1ZXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwMDg2OTcsImV4cCI6MjA1NDU4NDY5N30.4-llQURzUX1uUp0dplmfIKxS9xYSqrS9KpEdpr8Ie7k";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function addPost() {
    let postInput = document.getElementById("postInput");
    let fileInput = document.getElementById("fileInput");
    let postsDiv = document.getElementById("posts");

    if (postInput.value.trim() === "" && fileInput.files.length === 0) {
        alert("Cannot post empty content.");
        return;
    }

    let postContent = postInput.value;
    let file = fileInput.files[0];

    let fileUrl = "";
    if (file) {
        fileUrl = await uploadFile(file);
    }

    let newPost = document.createElement("div");
    newPost.className = "post";
    newPost.innerHTML = `<p>${postContent}</p>` + (fileUrl ? generateMediaHTML(fileUrl, file.type) : "");
    
    postsDiv.prepend(newPost);
    savePost(postContent, fileUrl, file?.type);

    postInput.value = "";
    fileInput.value = "";
}

async function uploadFile(file) {
    let fileName = Date.now() + "-" + file.name;
    let { data, error } = await supabaseClient.storage.from("uploads").upload(fileName, file);

    if (error) {
        console.error("Upload error:", error);
        alert("File upload failed.");
        return "";
    }

    return `${SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
}

function generateMediaHTML(fileUrl, fileType) {
    if (fileType.startsWith("image")) {
        return `<img src="${fileUrl}" alt="Uploaded Image">`;
    } else if (fileType.startsWith("video")) {
        return `<video controls><source src="${fileUrl}" type="${fileType}"></video>`;
    }
    return "";
}

function savePost(content, fileUrl, fileType) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.unshift({ content, fileUrl, fileType });
    localStorage.setItem("posts", JSON.stringify(posts));
}

function loadPosts() {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    let postsDiv = document.getElementById("posts");

    posts.forEach(({ content, fileUrl, fileType }) => {
        let newPost = document.createElement("div");
        newPost.className = "post";
        newPost.innerHTML = `<p>${content}</p>` + (fileUrl ? generateMediaHTML(fileUrl, fileType) : "");
        postsDiv.appendChild(newPost);
    });
}

window.onload = loadPosts;
