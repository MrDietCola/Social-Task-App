const removeTagHandler = async (event) => {
    
    if (event.target.tagName.toLowerCase() == 'button') {
        const tag_id = event.target.getAttribute('data-tag');
        const task_id = document.getElementById('tag-list').getAttribute('data-task');
        console.log(tag_id);
        console.log(task_id);
        const response = await fetch(`/api/tasks/tag/${task_id}`, {
            method: 'DELETE',
            body: JSON.stringify({
                tag_id
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            document.location.reload();
        } else {
            alert('Failed to remove tag');
        }
    }
};

document.getElementById('tag-list').addEventListener('click', removeTagHandler);