export const Auth = () => {
    const data = localStorage.getItem('dataUser');
    const dataUser = JSON.parse(data)
    return dataUser ? dataUser.token : null
}
   
