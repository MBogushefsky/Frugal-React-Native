export default interface CurrentUserData {
    Id: string;
    username: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
}