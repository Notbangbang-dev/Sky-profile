// More code
const username = "notbangbang-dev";

const yearElement = document.getElementById("year");
const repositoryContainer = document.getElementById("repositories");
const projectSection = document.getElementById("projects");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

async function loadRepositories() {
    if (!repositoryContainer || !projectSection) return;

    repositoryContainer.replaceChildren();

    const loading = document.createElement("p");
    loading.className = "loading";
    loading.textContent = "Loading repositories...";
    repositoryContainer.appendChild(loading);

    try {
        const response = await fetch(
            `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&direction=desc&per_page=100`,
            {
                headers: {
                    Accept: "application/vnd.github+json"
                }
            }
        );

        if (!response.ok) {
            if (response.status === 403 || response.status === 429) {
                throw new Error("GitHub API rate limit reached. Please try again later.");
            }

            if (response.status === 404) {
                throw new Error("GitHub user not found.");
            }

            throw new Error(`GitHub API returned status ${response.status}.`);
        }

        const repositories = await response.json();

        if (!Array.isArray(repositories)) {
            throw new Error("Invalid repository data received.");
        }

        const projects = repositories
            .filter(repo => !repo.fork && !repo.archived && !repo.disabled)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 12);

        if (projects.length === 0) {
            projectSection.hidden = true;
            return;
        }

        const fragment = document.createDocumentFragment();

        projects.forEach(repo => {
            const card = document.createElement("article");
            card.className = "repo-card";

            const link = document.createElement("a");
            link.href = repo.html_url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = repo.name;
            link.setAttribute("aria-label", `View ${repo.name} on GitHub`);

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

            const stats = document.createElement("div");
            stats.className = "repo-stats";

            const stars = document.createElement("span");
            stars.textContent = `★ ${repo.stargazers_count}`;

            const forks = document.createElement("span");
            forks.textContent = `⑂ ${repo.forks_count}`;

            stats.append(stars, forks);

            card.append(link, description, language, stats);
            fragment.appendChild(card);
        });

        repositoryContainer.replaceChildren(fragment);
        projectSection.hidden = false;

    } catch (error) {
        console.error("GitHub API error:", error);

        const message = document.createElement("p");
        message.className = "empty-state";
        message.textContent = error.message || "Unable to load repositories right now.";

        repositoryContainer.replaceChildren(message);
    }
}

loadRepositories();
// Hi future me looking at this, wyd
