import { v4 as uuidv4 } from "uuid";
import { User } from "./user.js";

type ItemCounts = {
    totalUsers: number;
    activeUsers: number;
    suspendedUsers: number;
}
export class UserCollection {
    private itemMap = new Map<string, User>()
    constructor(public name: string, public dB: User[] = []) {
        dB.forEach(entry => this.itemMap.set(entry.id, entry))
    }

    addUser(firstname: string, lastName: string, username: string, password: string, email: string, phoneNumber: string, status: boolean = true) {
        const userId =  uuidv4()
        this.itemMap.set(userId, new User(userId, firstname, lastName, username, password, email, phoneNumber, status))
        return userId;
    }
    getUsers(includeSuspended = true) {
        return [...this.itemMap.values()].filter(item => item.active || includeSuspended)
    }
    getUserById(id: string) {
        return this.itemMap.get(id);
    }
    updateUserStatus(id: string, status: boolean) {
        const user = this.getUserById(id)
        if (user) {
            user.active = status;
        }
    }
    getItemCount(): ItemCounts {
        return {
            totalUsers: this.itemMap.size,
            activeUsers: this.getUsers(false).length,
            suspendedUsers: this.itemMap.size - this.getUsers(false).length
        }
    }
    deleteUser(id: string): string {
    
        return this.itemMap.delete(id) ? "Deleted" : "Error"
    }
    
}