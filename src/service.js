const RANDOM_FOOD_API = 'https://www.themealdb.com/api/json/v1/1/random.php';

export async function getRandomFood() {
  try {
    const response = await fetch(RANDOM_FOOD_API);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.meals[0].strMeal;
  } catch (error) {
    console.error('Failed to fetch random food:', error);
    return null;
  }
}

export async function getCurrentRound() {
  try {
    const response = await fetch('/api/current-round', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Failed to fetch current round', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch current round', error);
    return null;
  }
}


export async function getGames() {
  try {
    const response = await fetch('/api/score', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Failed to fetch games from service', response.status);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch games', error);
    return [];
  }
}

export async function saveGame(game) {
  try {
    const response = await fetch('/api/score', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(game),
    });
    if (!response.ok) {
      console.error('Failed to save game', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to save game', error);
    return null;
  }
}
