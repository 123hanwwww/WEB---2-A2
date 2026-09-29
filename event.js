// js/event.js
// Event detail page logic: read the id query parameter, fetch the event,
// and render its full details including a fundraising progress bar.

const API_BASE = 'http://localhost:3000/api';

const id = new URLSearchParams(window.location.search).get('id');
const container = document.getElementById('event-detail');

document.addEventListener('DOMContentLoaded', loadEvent);

async function loadEvent() {
  if (!id) {
    container.innerHTML = '<p class="error">No event selected.</p>';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/events/${id}`);

    if (res.status === 404) {
      container.innerHTML = '<p class="error">Event not found.</p>';
      return;
    }
    if (!res.ok) {
      throw new Error(`Server responded with status ${res.status}`);
    }

    const event = await res.json();
    renderEvent(event);
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p class="error">Failed to load event details. Please try again later.</p>';
  }
}

function renderEvent(event) {
  const goal = Number(event.goal_amount) || 0;
  const raised = Number(event.raised_amount) || 0;
  const progress = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0;
  const price = Number(event.ticket_price) === 0
    ? 'Free'
    : `$${Number(event.ticket_price).toFixed(2)}`;

  container.innerHTML = `
    <img class="detail-img" src="${escapeHtml(event.image_url)}" alt="${escapeHtml(event.event_name)}" onerror="this.style.display='none'">
    <div class="detail-content">
      <span class="badge upcoming">${escapeHtml(event.category_name)}</span>
      <h1>${escapeHtml(event.event_name)}</h1>

      <p class="detail-meta"><strong>Date:</strong> ${formatDate(event.event_date)}</p>
      <p class="detail-meta"><strong>Location:</strong> ${escapeHtml(event.location)}</p>
      <p class="detail-meta"><strong>Ticket price:</strong> ${escapeHtml(price)}</p>

      <h2>About this event</h2>
      <p>${escapeHtml(event.description)}</p>

      <h2>Organiser</h2>
      <p><strong>${escapeHtml(event.org_name)}</strong></p>
      <p>${escapeHtml(event.mission)}</p>
      <p>Contact: <a href="mailto:${escapeHtml(event.contact_email)}">${escapeHtml(event.contact_email)}</a></p>

      <h2>Fundraising progress</h2>
      <div class="progress">
        <div class="progress-bar" style="width: ${progress}%"></div>
      </div>
      <p class="progress-label">
        $${raised.toLocaleString('en-AU', { minimumFractionDigits: 2 })} raised of
        $${goal.toLocaleString('en-AU', { minimumFractionDigits: 2 })} goal
        (${progress.toFixed(0)}%)
      </p>

      <button id="register-btn" class="btn btn-primary">Register</button>
    </div>
  `;

  document.getElementById('register-btn').addEventListener('click', () => {
    alert('This feature is currently under construction.');
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Escape HTML to avoid rendering issues with data containing special characters.
function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
