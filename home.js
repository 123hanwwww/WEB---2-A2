// js/home.js
// Home page logic: fetch upcoming/active events and render cards.

const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', loadEvents);

async function loadEvents() {
  const container = document.getElementById('events-container');
  try {
    const res = await fetch(`${API_BASE}/events`);
    if (!res.ok) {
      throw new Error(`Server responded with status ${res.status}`);
    }
    const events = await res.json();

    container.innerHTML = '';
    if (events.length === 0) {
      container.innerHTML = '<p class="empty">No upcoming events at the moment.</p>';
      return;
    }

    events.forEach(event => container.appendChild(createEventCard(event)));
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p class="error">Failed to load events. Please try again later.</p>';
  }
}

function createEventCard(event) {
  const card = document.createElement('article');
  card.className = 'card';

  const img = document.createElement('img');
  img.className = 'card-img';
  img.src = event.image_url;
  img.alt = event.event_name;
  img.onerror = () => {
    img.style.display = 'none';
  };

  const body = document.createElement('div');
  body.className = 'card-body';

  // Upcoming / Past badge based on comparison with the current date.
  const isUpcoming = new Date(event.event_date) > new Date();
  const badge = document.createElement('span');
  badge.className = isUpcoming ? 'badge upcoming' : 'badge past';
  badge.textContent = isUpcoming ? 'Upcoming' : 'Past';

  const title = document.createElement('h3');
  title.textContent = event.event_name;

  const category = document.createElement('p');
  category.className = 'card-meta';
  category.textContent = event.category_name;

  const location = document.createElement('p');
  location.className = 'card-meta';
  location.textContent = event.location;

  const date = document.createElement('p');
  date.className = 'card-meta';
  date.textContent = formatDate(event.event_date);

  const price = document.createElement('p');
  price.className = 'card-price';
  price.textContent = Number(event.ticket_price) === 0
    ? 'Free'
    : `$${Number(event.ticket_price).toFixed(2)}`;

  const link = document.createElement('a');
  link.className = 'btn btn-primary card-link';
  link.href = `event.html?id=${event.event_id}`;
  link.textContent = 'View Details';

  body.append(badge, title, category, location, date, price, link);
  card.append(img, body);
  return card;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
