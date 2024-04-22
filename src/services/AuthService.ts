export async function userExists(email : string) {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/users/checkUserExists?email=${email}`);
    const data = await response.json();

    return data.exists;
}