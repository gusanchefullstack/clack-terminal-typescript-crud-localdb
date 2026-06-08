
export class User {
    constructor(public id: string, public firstname: string, public lastName: string, public username: string, public password: string, public email: string, public phoneNumber: string, public active: boolean = true) {
        
    }

    printDetails() {
        console.log(`id: ${this.id} \tName: ${this.firstname} ${this.lastName} \tUsername: ${this.username} \tEmail: ${this.email} \tPhone: ${this.phoneNumber} \tActive: ${this.active}`)
    }
}

