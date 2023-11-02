const newTaskHandler = async (event) => {
  event.preventDefault();

  const title = document.getElementById('task-title-input').value.trim();
  const body = document.getElementById('task-body-input').value.trim();
  const state = document.getElementById('task-state-input').value.trim();
  const visibility = document.getElementById('task-visibility-input').checked;

  console.log(title, body, state, visibility);
  if (title && body && state) {
    const response = await fetch(`/api/tasks`, {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        description: body,
        state: state,
        public: visibility,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      document.location.replace('/tasks');
    } else {
      alert('Failed to create task');
    }
  }
};

document.querySelector('.new-task-form').addEventListener('submit', newTaskHandler);