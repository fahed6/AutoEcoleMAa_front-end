import { FileHandle } from "./file-hande.model"

export interface Student{
    userFirstName:string,
    userLastName:string,
    studentCin:string,
    studentDateCin:Date,
    studentPhone:string,
    studentAddress:string,
    userPassword:string,
    studentImage:FileHandle[]

}