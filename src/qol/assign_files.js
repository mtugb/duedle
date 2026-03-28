const attachedFiles = Array.from(document.querySelectorAll("a"));
attachedFiles.map((item) => {
    if (!item.href.includes("submission_files")&&item.href.includes("?forcedownload=1")) {
        const url = item.getAttribute("href");
        item.setAttribute("href", url.replace("?forcedownload=1", ""));
    }
});

//opensubmitfile
document.addEventListener("click", async (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    if (a.href.includes("submission_files")) {
        e.preventDefault();

        const res = await fetch(a.href, { credentials: "include" });
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        window.open(blobUrl, "_blank");
    }
});
