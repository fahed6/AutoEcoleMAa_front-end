import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FileHandle } from '../_model/file-hande.model';
import { Student } from '../_model/student.model';
import { StudentService } from '../_services/student.service';


@Component({
  selector: 'app-add-new-student',
  templateUrl: './add-new-student.component.html',
  styleUrl: './add-new-student.component.css'
})
export class AddNewStudentComponent implements OnInit{
  
  isNewStudent = true;


  student:Student={
    userFirstName:"",
    userLastName:"",
    studentCin:"",
    studentDateCin:new Date('0000-00-00'),
    studentPhone:"",
    studentAddress:"",
    userPassword:"",
    studentImage:[],
    
  }
  constructor(private studentService:StudentService,
              private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    this.student = this.activatedRoute.snapshot.data['student'];

    if(this.student && this.student.studentCin) {
      this.isNewStudent = false;
    }
  }
  addStudent(studentForm:NgForm){
    const formData = this.prepareFormDataForStudent(this.student);
    this.studentService.addStudent(formData).subscribe(
      (response:Student)=>{
        studentForm.reset();
        this.student.studentImage = [];
        
      },
      (error:HttpErrorResponse)=>{
        console.log(error);
      }
    );
  }


  prepareFormDataForStudent(student: Student): FormData {
    const uploadImageData = new FormData();
    uploadImageData.append(
      "student",
      new Blob([JSON.stringify(student)], { type: "application/json" })
    );

    for (var i = 0; i < this.student.studentImage.length; i++) {
      uploadImageData.append(
        "imageFile",
        this.student.studentImage[i].file,
        this.student.studentImage[i].file.name
      );
    }
    return uploadImageData;
  }
  


  onFileSelected(event: any) {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        ),
      };
      this.student.studentImage.push(fileHandle);
    }
  }

  removeImages(i: number) {
    this.student.studentImage.splice(i, 1);
  }

  fileDropped(fileHandle: FileHandle) {
    this.student.studentImage.push(fileHandle);
  }

}
