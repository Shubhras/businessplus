import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { AlertService, UserService } from 'app/main/apps/_services';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  user_id: any;
  //userAbout: any;
  userPicture: any;
  userDataAbout: any = { data: '' };
  selectedFile: File = null;
  LoginUserDetails: any;
  /**
   * Constructor
   */
  constructor(
    private userService: UserService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private _fuseConfigService: FuseConfigService
  ) {

  }
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.LoginUserDetails = JSON.parse(localStorage.getItem('LoginUserDetails'))
    this.user_id = this.currentUser.data.id;
    this.UserProfileGet();
  }
  profileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.userPicture = event.target.result;
    }
    this.pictureUpload();
  }
  pictureUpload() {
    const fd = new FormData();
    fd.append('photo', this.selectedFile, this.selectedFile.name);
    fd.append('login_access_token', this.currentUser.login_access_token);
    fd.append('user_id', this.user_id);
    // console.log("formdata", fd);

    this.userService.userPictureUpload(fd).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);
          this.UserProfileGet();
        }
        else {
          //console.log(data);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  UserProfileGet() {
    let login_access_token = this.currentUser.login_access_token;
    let role_id = this.currentUser.role_id;
    let user_id = this.currentUser.data.id;
    this.userService.GetUserProfile(login_access_token, role_id, user_id).pipe(first()).subscribe(
      (data: any) => {
        this.userDataAbout = data.data.user_data;
        if (this.userDataAbout.profile_picture != '') {
          this.userPicture = this.userDataAbout.profile_picture;
          this.currentUser.data.profile_picture = this.userPicture;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
        else {
          this.userPicture = "assets/images/avatars/profile.jpg";
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
}
