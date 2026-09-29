// js/search.js
// Search page logic: populate categories, filter events, clear filters,
// and show result / error / empty states.

const API_BASE = 'http://localhost:3000/api';

const form = document.getElementById('search-form');
const dateInput = document.getElementById('date');
const locationInput = document.getElementById('location');
const categorySelect = document.getElementById('category');
const clearBtn = document.getElementById('clear-btn');
const resultsContainer = document.getElementById('results');

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  form.addEventListener('submit', handleSearch);
  clearBtn.addEventListener('click', clearFilters);
});

async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) {
      throw new Error(`Server responded with status ${res.status}`);
    }
    const categories = await res.json();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.category_id;
      option.textContent = category.category_name;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error(err);
    resultsContainer.innerHTML =
      '<p class="error">Could not load categories. Please refresh the page.</p>';
  }
}

async function handleSearch(event) {
  event.preventDefault();

  // Validate the date format before calling the API.
  if (dateInput.value && !isValidDate(dateInput.value)) {
    resultsContainer.innerHTML =
      '<p class="error">Invalid date. Please enter a valid date.</p>';
    return;
  }

  const params = new URLSearchParams();
  if (dateInput.value) params.append('date', dateInput.value);
  if (locationInput.value.trim()) params.append('location', locationInput.value.trim());
  if (categorySelect.value) params.append('category_id', categorySelect.value);

  try {
    const res = await fetch(`${API_BASE}/events/search?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Server responded with status ${res.status}`);
    }
    const events = await res.json();
    renderResults(events);
  } catch (err) {
    console.error(err);
    resultsContainer.innerHTML =
      '<p class="error">Failed to search events. Please try again later.</p>';
  }
}

function renderResults(events) {
  resultsContainer.innerHTML = '';
  if (events.length === 0) {
    resultsContainer.innerHTML =
      '<p class="empty">No events match your criteria.</p>';
    return;
  }
  events.forEach(event => resultsContainer.appendChild(createResultCard(event)));
}

function createResultCard(event) {
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

  const link = document.createElement('a');
  link.className = 'btn btn-primary card-link';
  link.href = `event.html?id=${event.event_id}`;
  link.textContent = 'View Details';

  body.append(title, category, location, date, link);
  card.append(img, body);
  return card;
}

function clearFilters() {
  // Reset all form fields using DOM properties, then clear the results area.
  form.reset();
  resultsContainer.innerHTML = '';
}

function isValidDate(dateStr) {
  const match = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  if (!match) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
