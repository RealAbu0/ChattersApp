export interface User{
    id?: number,
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    token: string,
    role: string
    userConnectionSocketId: string;
} 