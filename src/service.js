

export function serviceLoginUser(Name) {
    console.log(`login user with name: ${Name}`);

    const users = JSON.parse((localStorage.getItem('users') || '[]'));
    users.push({Name: Name});
    const user = users.find(user => user.Name === Name);
    localStorage.setItem('users', JSON.stringify(users));


    if (user) {
        console.log('Login successful');
    } else {
        console.log('Login failed');
    }
}