class PageArticle {
  loadUserProfile(user) {
    this._setFigureImage(user.avatar_url);
    this._setFigureTitle(user.name);
    this._setFigureLabel(user.location);
    this._setArticleBio(user.bio);
    this._setSocialLinks([
      { label: "Profile", url: user.html_url },
      { label: "Repos", url: `${user.html_url}?tab=repositories` },
      { label: "Gists", url: user.gists_url },
      { label: "Starred", url: `${user.html_url}?tab=stars` },
      { label: "Projects", url: `${user.html_url}?tab=projects` },
    ]);
  }

  _setFigureImage(image) {
    document.querySelector("article figure img").src = image;
    document.querySelector("article figure img").style.filter =
      "grayscale(60%)";
  }

  _setFigureTitle(title) {
    document.querySelector("article figure figcaption h1").innerText = title;
  }

  _setFigureLabel(label) {
    document.querySelector("article figure figcaption p").innerText = label;
  }

  _setArticleBio(bio) {
    document.querySelector("article > p").innerText = bio;
  }

  _setSocialLink(pos, name, url) {
    const a = document.querySelector(`article ul > li:nth-child(${pos}) > a`);
    if (!a) return;
    Object.assign(a, { href: url, innerText: name, target: "_blank" });
  }

  _setSocialLinks(links) {
    for (let i = 0; i < links.length; i++) {
      const a = document.querySelector(
        `article ul > li:nth-child(${i + 1}) > a`
      );
      if (!a) continue;
      Object.assign(a, {
        href: links[i].url,
        innerText: links[i].label,
        target: "_blank",
      });
    }
  }
}

class GithubClient {
  getGithubUserProfile() {
    const profile = new URLSearchParams(location.search).get("profile");
    if (!profile) return;
    return fetch(`https://api.github.com/users/${profile}`)
      .then((res) => res.json())
      .then((data) => ({
        avatar_url: data.avatar_url,
        name: data.name,
        location: data.location,
        bio: data.bio,
        html_url: data.html_url,
        gists_url: `https://gist.github.com/${profile}`,
      }));
  }
}

window.addEventListener("DOMContentLoaded", async function () {
  try {
    const githubClient = new GithubClient();
    const userProfile = await githubClient.getGithubUserProfile();

    if (!userProfile) return;
    const article = new PageArticle();
    article.loadUserProfile(userProfile);
  } catch (e) {
    console.error(e);
  }
});
