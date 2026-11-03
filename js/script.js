document.getElementById("year").textContent =
    new Date().getFullYear();

const username = "notbangbang-dev";

const repositoryContainer =
    document.getElementById("repositories");

const projectSection =
    document.getElementById("projects");

async function loadRepositories() {
    try {
        const response = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=12&type=public`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch repositories.");
        }

        const repositories = await response.json();

        const projects = repositories.filter(repo => !repo.fork);

        if (projects.length === 0) {
            projectSection.hidden = true;
            return;
        }

        repositoryContainer.innerHTML = "";

        projects.forEach(repo => {
            const card = document.createElement("article");
            card.className = "repo-card";

            const link = document.createElement("a");
            link.href = repo.html_url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = repo.name;

            const description = document.createElement("p");
            description.textContent =
                repo.description || "No description provided.";

            const language = document.createElement("div");
            language.className = "repo-language";

            if (repo.language) {
                const dot = document.createElement("span");
                dot.className = "language-dot";

                const label = document.createElement("span");
                label.textContent = repo.language;

                language.append(dot, label);
            } else {
                language.textContent = "Project";
            }

            card.append(link, description, language);
            repositoryContainer.appendChild(card);
        });

    } catch (error) {
        console.error("GitHub API error:", error);

        repositoryContainer.innerHTML =
            '<p class="empty-state">Unable to load repositories right now.</p>';
    }
}

loadRepositories();
