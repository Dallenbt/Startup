const RANDOM_FOOD_API = 'https://www.themealdb.com/api/json/v1/1/random.php';

export async function getRandomFood() {
  try {
    const response = await fetch(RANDOM_FOOD_API);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched random food:', data.meals[0].strMeal);
    return data.meals[0].strMeal; 
  } catch (error) {
    console.error('Failed to fetch random food:', error);
    return null;
  }
}




export function serviceLoginUser(Name) {
    console.log(`login user with name: ${Name}`);

    const users = JSON.parse((localStorage.getItem('users') || '[]'));
    users.push({Name: Name});
    const user = users.find(user => user.Name === Name);
    localStorage.setItem('users', JSON.stringify(users));


    if (user) {
        console.log('Login successful');
        console.log(user);
        return user;
    } else {
        console.log('Login failed');
    }
}