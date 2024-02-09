import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../_model/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private httpClient:HttpClient) { }

public addStudent(student:FormData){
  return this.httpClient.post<Student>("http://localhost:8080/registerNewStudent",student);
}


public getAllStudents(){
  return this.httpClient.get<Student[]>("http://localhost:8080/getAllStudents");
}

public deleteStudent(userName: string){
  return this.httpClient.delete("http://localhost:8080/deleteStudent/"+userName);
}

public getStudentDetailsById(userName: string) {
  return this.httpClient.get<Student>("http://localhost:8080/getStudentDetailsById/"+userName);
}


}
