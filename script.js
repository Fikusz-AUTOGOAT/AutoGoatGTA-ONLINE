function initGamePage(gameId) {
  const likeBtn = document.getElementById(`likeBtn${gameId}`);
  const dislikeBtn = document.getElementById(`dislikeBtn${gameId}`);
  const likeCount = document.getElementById(`likeCount${gameId}`);
  const dislikeCount = document.getElementById(`dislikeCount${gameId}`);
  const commentForm = document.getElementById(`commentForm${gameId}`);
  const commentList = document.getElementById(`commentList${gameId}`);

  // Wczytaj dane z localStorage
  let likes = parseInt(localStorage.getItem(`likes_${gameId}`)) || 0;
  let dislikes = parseInt(localStorage.getItem(`dislikes_${gameId}`)) || 0;
  let voted = localStorage.getItem(`voted_${gameId}`) || null;
  let comments = JSON.parse(localStorage.getItem(`comments_${gameId}`)) || [];

  likeCount.textContent = likes;
  dislikeCount.textContent = dislikes;
  renderComments();

  // Obsługa lajków
  likeBtn.addEventListener("click", () => {
    if (voted === "like") return;
    if (voted === "dislike") {
      dislikes--;
      localStorage.setItem(`dislikes_${gameId}`, dislikes);
    }
    likes++;
    voted = "like";
    updateVotes();
  });

  // Obsługa dislajków
  dislikeBtn.addEventListener("click", () => {
    if (voted === "dislike") return;
    if (voted === "like") {
      likes--;
      localStorage.setItem(`likes_${gameId}`, likes);
    }
    dislikes++;
    voted = "dislike";
    updateVotes();
  });

  function updateVotes() {
    likeCount.textContent = likes;
    dislikeCount.textContent = dislikes;
    localStorage.setItem(`likes_${gameId}`, likes);
    localStorage.setItem(`dislikes_${gameId}`, dislikes);
    localStorage.setItem(`voted_${gameId}`, voted);
  }

  // Obsługa komentarzy
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById(`username${gameId}`).value;
    const text = document.getElementById(`commentText${gameId}`).value;

    const newComment = { user: username, text: text };
    comments.push(newComment);
    localStorage.setItem(`comments_${gameId}`, JSON.stringify(comments));

    renderComments();
    commentForm.reset();
  });

  function renderComments() {
    commentList.innerHTML = "";
    comments.forEach(c => {
      const li = document.createElement("li");
      li.textContent = `${c.user}: ${c.text}`;
      commentList.appendChild(li);
    });
  }
}
