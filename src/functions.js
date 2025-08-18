function remove_duplicate_titles () {
    var prior_title = '';
    document.querySelectorAll("div.clipping").forEach((e) => {
        let te = e.querySelector("h2.title");
        if (te && te.textContent === prior_title) {
            te.classList.add("hidden");
        } else {
            prior_title = te?.textContent;
        }
    });
}

remove_duplicate_titles();