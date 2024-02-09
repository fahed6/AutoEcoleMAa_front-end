import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Student } from '../_model/student.model';
import { StudentService } from '../_services/student.service';
import { ImageProcessingService } from '../image-processing.service';
import { ImagesDialogComponent } from '../images-dialog/images-dialog.component';

@Component({
  selector: 'app-show-student-details',
  templateUrl: './show-student-details.component.html',
  styleUrl: './show-student-details.component.css'
})
export class ShowStudentDetailsComponent implements OnInit {
  studentDetails:Student[]=[];
  displayedColumns: string[] = ['Cin', 'Name', 'Address', 'Phone','Images','Edit','Delete'];
  
  constructor( private studentService: StudentService, public imagesDialog: MatDialog, private imageProcessingService: ImageProcessingService,private router: Router){}

  ngOnInit(): void {
    this.getAllStudents();
  }

  public getAllStudents(){
    this.studentService.getAllStudents()
    .pipe(
      map((x: Student[], i) => x.map((student: Student) => this.imageProcessingService.createImages(student)))
    )
    .subscribe(
      (resp:Student[])=>{
        console.log(resp);
        this.studentDetails=resp;
      }, (error:HttpErrorResponse)=>{
        console.log(error);
      }

    );
  }
  public deleteStudent(userName: string){
    this.studentService.deleteStudent(userName).subscribe(
      (resp)=>{
        this.getAllStudents();
      }, (error:HttpErrorResponse)=>{
        console.log(error);
      }

    );
  }


  public showImages(student: Student){
    console.log(student);
    this.imagesDialog.open(ImagesDialogComponent, {
      data: {
        images: student.studentImage,
        userName:student.studentCin
      },
      height: '500px',
      width: '800px'
    });
  }

  public editStudent(userName: string){
    this.router.navigate(['/addNewStudent', {userName: userName}]);
  }

}
