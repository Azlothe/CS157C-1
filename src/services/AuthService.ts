export async function userExists(email : string) {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/users/checkUserExists?email=${email}`);
    const data = await response.json();

    return data.exists;
}

export async function signUp(username : string, email : string) {
    fetch(`${import.meta.env.VITE_SERVER}/users/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email })
    })
    .then(response => {
        if (!response.ok) 
            throw new Error('Signup request failed');

        return response.json();
    })
    .then(data => data)
    .catch(error => {
        console.error('There was a problem with the signup request:', error);
    });
}