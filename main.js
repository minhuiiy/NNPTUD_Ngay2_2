const API = "http://localhost:3000/posts";

async function getData() {
    const res = await fetch(API);
    const posts = await res.json();

    const body = document.getElementById("table_body");
    body.innerHTML = "";

    posts.forEach(p => {
        body.innerHTML += `
        <tr class="${p.isDeleted ? 'deleted' : ''}">
            <td>${p.id}</td>
            <td>${p.title}</td>
            <td>${p.views}</td>
            <td>
                ${p.isDeleted
                    ? `<button onclick="restore(${p.id})">Restore</button>`
                    : `<button onclick="softDelete(${p.id})">Delete</button>`
                }
            </td>
        </tr>
        `;
    });
}

// Soft delete
async function softDelete(id) {
    await fetch(API + "/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });
    getData();
}

// Restore
async function restore(id) {
    await fetch(API + "/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: false })
    });
    getData();
}

// Save
async function Save() {
    const id = document.getElementById("txt_id").value;
    const title = document.getElementById("txt_title").value;
    const views = document.getElementById("txt_views").value;

    const res = await fetch(API);
    const posts = await res.json();

    if (id) {
        // edit
        await fetch(API + "/" + id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, views })
        });
    } else {
        // create with auto ID
        const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0;

        const newPost = {
            id: maxId + 1,
            title,
            views: Number(views),
            isDeleted: false
        };

        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPost)
        });
    }

    getData();
}

getData();
