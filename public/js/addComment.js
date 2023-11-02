const handleNewComment = async (event) => {
    event.preventDefault();

    const comment_text = document.getElementById('comment-input').value.trim()
    const task_id = document.getElementById('comment-form-container').getAttribute('data-task');

    if (comment_text && task_id) {
        const response = await fetch(`/api/comments`, {
            method: 'POST',
            body: JSON.stringify({
                comment_text,
                task_id
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            document.location.reload();
        }
        else if (response.status == 440) {
            alert('Session Expired. Please log in again');
            document.location.href('/login');
        }
        else {
            alert('Failed to create comment');
        }
    }
}


document.getElementById('comment-form').addEventListener('submit', handleNewComment);