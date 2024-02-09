
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_auth/auth.guard';
import { AddNewStudentComponent } from './add-new-student/add-new-student.component';
import { AdminComponent } from './admin/admin.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ShowStudentDetailsComponent } from './show-student-details/show-student-details.component';
import { StudentResolveService } from './student-resolve.service';
import { UserComponent } from './user/user.component';
import { CalanderComponent } from './calander/calander.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivate:[AuthGuard], data:{roles:['Admin']} },
  { path: 'user', component: UserComponent ,  canActivate:[AuthGuard], data:{roles:['User']} },
  { path: 'calander', component: CalanderComponent, canActivate:[AuthGuard], data:{roles:['Admin']} },
  { path: 'login', component: LoginComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'addNewStudent', component: AddNewStudentComponent, canActivate:[AuthGuard], data:{roles:['Admin']}, resolve: {
    student: StudentResolveService,
  },},
  { path: 'ShowStudentDetails', component: ShowStudentDetailsComponent, canActivate:[AuthGuard], data:{roles:['Admin']}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}