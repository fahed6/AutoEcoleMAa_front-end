import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Student } from './_model/student.model';
import { StudentService } from './_services/student.service';
import { ImageProcessingService } from './image-processing.service';
@Injectable({
  providedIn: 'root'
})
export class StudentResolveService implements Resolve<Student>{

  constructor(private studentService: StudentService,
    private imageProcessingService: ImageProcessingService) { }
    resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<Student> {
      const id = route.paramMap.get("userName");
  
      if (id) {
        //then we have to fetch details from backend
         return this.studentService.getStudentDetailsById(id)
                .pipe(
                  map(p => this.imageProcessingService.createImages(p))
                );
      } else {
        // return empty product observable.
        return of(this.getStudentDetails());
      }
    }
  
    getStudentDetails() {
      return {
        userFirstName:"",
        userLastName:"",
        studentCin:"",
        studentDateCin:new Date('0000-00-00'),
        studentPhone:"",
        studentAddress:"",
        userPassword:"",
        studentImage:[],
      };
    }
}
