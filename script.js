<script>
// ===== Liczba wyświetleń =====
let views = localStorage.getItem('clubViews') || 0;
views++;
localStorage.setItem('clubViews', views);
document.getElementById('views').innerText = views;

// ===== Like / Dislike =====
let likes = localStorage.getItem('clubLikes') || 0;
let dislikes = localStorage.getItem('clubDislikes') || 0;
document.getElementById('likes').innerText = likes;
document.getElementById('dislikes').innerText = dislikes;

document.getElementById('likeBtn').addEventListener('click', () => {
    likes++;
    localStorage.setItem('clubLikes', likes);
    document.getElementById('likes').innerText = likes;
});

document.getElementById('dislikeBtn').addEventListener('click', () => {
    dislikes++;
    localStorage.setItem('clubDislikes', dislikes);
    document.getElementById('dislikes').innerText = dislikes;
});

// ===== Komentarze =====
let comments = JSON.parse(localStorage.getItem('clubComments')) || [];
const commentsList = document.getElementById('commentsList');

function renderComments() {
    commentsList.innerHTML = '';
    comments.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        commentsList.appendChild(li);
    });
}

renderComments();

document.getElementById('commentBtn').addEventListener('click', () => {
    const commentInput = document.getElementById('commentInput');
    const comment = commentInput.value.trim();
    if(comment) {
        comments.push(comment);
        localStorage.setItem('clubComments', JSON.stringify(comments));
        renderComments();
        commentInput.value = '';
    }
});
</script>
