import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
@Component({
  selector: 'agenda',
  templateUrl: 'agenda.component.html',
  styleUrls: ['./governance-table.scss'],

})
export class AgendaComponent {
  AgendaDef: any;
  dummyPicture: any;
  chairPersonName: any;
  chairPersonImg: any;
  coChairPersonName: any;
  coChairPersonImg: any;
  govFrequency: any;
  govDuration: any;
  govVenue: any;
  meetingName: any;
  meetingDay: any;
  meetingShedule: any;
  govMembers: any;
  constructor(
    public dialogRef: MatDialogRef<AgendaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }
  ngOnInit(): void {
    this.dummyPicture = "assets/images/avatars/profile.jpg";
    this.AgendaDef = this.data.Mom;
    this.chairPersonName = this.data.chair_person_name;
    this.chairPersonImg = this.data.chair_person_img;
    this.coChairPersonName = this.data.co_chair_person_name;
    this.coChairPersonImg = this.data.co_chair_person_img;
    this.govFrequency = this.data.gov_frequency;
    this.govDuration = this.data.gov_duration;
    this.govVenue = this.data.gov_venue;
    this.meetingDay = this.data.meeting_day;
    this.meetingName = this.data.meeting_name;
    this.meetingShedule = this.data.meeting_shedule;
    this.govMembers = this.data.gov_members;
  }
  AgendaClose(): void {
    this.dialogRef.close();
  }
}