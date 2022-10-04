import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, VERSION } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AlertService, UserService } from '../_services';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MatVerticalStepper, MatStepper } from '@angular/material';
import { log } from 'console';
/* import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'; */
//import { DatePipe } from '@angular/common';
@Component({
    selector: 'company-setup',
    templateUrl: './company-setup.component.html',
    styleUrls: ['./company-setup.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CompanySetupComponent implements OnInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    @ViewChild('scrollMe2') private myScrollContainer2: ElementRef;
    @ViewChild('scrollMeSection') private myScrollContainerSection: ElementRef;
    @ViewChild(MatVerticalStepper) stepper: MatVerticalStepper;

    name = 'Angular ' + VERSION.major;
    expandedIndex = 0;
    direction = 'row';
    slideshow1 = true;
    slideshow2 = false;
    slideshow3 = false;
    selectedIndex = 0;
    testnextstep = false;
    isLinear = true;
    isfiled = false;
    isfiled2 = false;
    isfiled3 = false;
    isfiled4 = false;
    isfiled5 = false;
    // step1Completed = false;
    //isLinear = false;
    companyFormGroup: FormGroup;
    unitFormGroup: FormGroup;
    form: FormGroup;
    deptFormGroup: FormGroup;
    usrFormGroup: FormGroup;
    sectionsFormGroup: FormGroup;
    userContSetFormGroup: FormGroup;
    storeUnitDate: any;
    currentUser: any;
    company_id: any;
    company_step_id: any;
    company_details: any;
    companyPicture: string;
    user_id: any;
    userName: any;
    unitsData: any;
    dataDepartment: any;
    listDeptPredefine: any;
    testclass: any;
    submitted = false;
    shouldShow = true;
    isClicked = false;
    status: boolean = false;
    testtwo: any;
    stepexpand = 0;
    // @ViewChild('stepper') stepper: MatStepper;
    usrdata: any;
    userListAllData: any;
    userrole: any;
    dataUserUnit: any;
    statusfailed: any;
    companyProfileAddstep = true;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,

        //public datepipe: DatePipe,
    ) {

        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: false
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }
    /**
     * On init
     */
    ngOnInit(): void {
        this.scrollToBottom();
        this.scrollToBottom2();
        this.scrollToBottomSection();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.companyPicture = "assets/images/avatars/profile.jpg";
        this.company_details = this.currentUser.data.company_details;
        let login_access_token = this.currentUser.login_access_token;
        this.user_id = this.currentUser.data.id;
        this.userName = this.currentUser.data.name;
        this.company_id = this.currentUser.data.company_id;
        this.unitsGet();
        this.SelectModuleGet();
        this.userLisetGet();
        this.companySettingViewSetup();
        this.getPredefineDpet();
        // redirect to dashboard if already company create
        if (this.company_details == "true") {
            this.router.navigate(['/apps/event-home']);
        }
        this.companyFormGroup = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            company_id: [this.company_id],
            user_id: [this.user_id],
            company_step_id: [this.company_step_id],
            step_no: [1],
            step_name: ['companyProfile'],
            companyDetails: ['comanyInfo'],
            company_name: ['', Validators.required],
            company_address: ['', Validators.required],
            image_id: [''],
            company_logo: [''],
            //company_city: ['', Validators.required],
            //company_state: ['', Validators.required]
        });
        this.unitFormGroup = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id: [this.user_id],
            company_id: [this.company_id],
            company_step_id: [this.company_step_id],
            step_no: [2],
            step_name: ['compayUnit', Validators.required],
            companyDetails: ['comanyUnit', Validators.required],
            itemunits: this._formBuilder.array([]),
        });
        // this.form = this._formBuilder.group({
        //     lessons: this._formBuilder.array([])users_id
        // });
        this.usrFormGroup = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            // name: ['', Validators.required,],
            // email: ['', [Validators.required, Validators.email]],
            user_id: [this.user_id],
            // password: ['Prima@123', Validators.required],
            // passwordConfirm: ['Prima@123'],
            // role_id: ['', Validators.required],
            company_id: [this.company_id],
            company_step_id: [this.company_id],
            // multi_dept_id: [[]],
            // // multi_unit_id: ['', Validators.required],
            // multi_section_id: [[]],
            step_no: [3],
            step_name: ['companyUser'],
            companyDetails: ['companyUser'],
            itemUsers: this._formBuilder.array([]),
        });
        this.deptFormGroup = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id: [this.user_id],
            company_id: [this.company_id],
            company_step_id: [this.company_step_id],
            step_no: [4],
            step_name: ['companyDept'],
            companyDetails: ['comanyDept'],
            itemDept: this._formBuilder.array([]),
        });

        this.sectionsFormGroup = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id: [this.user_id],
            company_id: [this.company_id],
            company_step_id: [this.company_step_id],
            step_no: [4],
            step_name: ['companySection'],
            companyDetails: ['comanySection'],
            itemSections: this._formBuilder.array([]),
        });
        this.userContSetFormGroup = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id: [this.user_id],
            company_id: [this.company_id],
            company_step_id: [this.company_step_id],
            step_no: [5],
            step_name: ['companyUserControl'],
            companyDetails: ['comanyUserContSet'],
            financial_year: ['', Validators.required],
            reminder_date: ['', Validators.required],
            reminder_frequency: ['', Validators.required],
            priority: [''],
        });
        //this.openMoveStep(2);
        //    this.usrFormGroup.value.itemUsers = [{user_id: this.user_id, users_id: " ", name: "Sarah Johnson",email:"ratuv@gmail.com", multi_unit_id: [74,84], multi_dept_id: [' '], multi_section_id: [' '], role_id: 2}];


        //     this.companyUsrAdd();
    }
    // ngAfterViewChecked() {        
    //     this.scrollToBottom();        
    // } 
    testtt(iddd1:any){
        let tttt =iddd1;
        console.log("tttttttttttttt",tttt);
        this.companySectionAdd();

    }
    bulletOne() {
        this.slideshow1 = true;
        this.slideshow2 = false;
        this.slideshow3 = false;
        console.log(this.slideshow1);
    }
    bulletTwo() {
        this.slideshow2 = true;
        this.slideshow1 = false;
        this.slideshow3 = false;
        console.log(this.slideshow2);
        console.log(this.slideshow1);
    }
    testnextstepbtn(){
        this.testnextstep = false;
    }

    setStep(index: number) {
        this.stepexpand = index;
    }
    expandopen() {
        this.stepexpand++;
        console.log("step", this.stepexpand);

    }
    nextStep() {
        this.stepexpand++;
    }
    panelnext0() {
        // this.isfiled2 = true;
        this.stepexpand = 0;
        console.log("step", this.stepexpand);
    }
    panelnext1() {
        // this.isfiled2 = true;
        this.stepexpand = 1;
        console.log("step", this.stepexpand);
        // this.testclass = 0;
    }
    panelnext2() {
        // this.isfiled2 = true;
        this.stepexpand = 2;
        console.log("step", this.stepexpand);
        // this.testclass = 0;
    }
    panelnext3() {
        // this.isfiled2 = true;
        this.stepexpand = 3;
        console.log("step", this.stepexpand);
        // this.testclass = 0;
    }
    panelnext4() {
        // this.isfiled2 = true;
        this.stepexpand = 4;
        console.log("step", this.stepexpand);
        // this.testclass = 0;
    }
    panelnext5() {
        this.stepexpand = 5;
        console.log("step", this.stepexpand);
    }
    prevStep() {
        this.stepexpand--;
    }
    bulletThree() {
        this.slideshow3 = true;
        this.slideshow2 = false;
        this.slideshow1 = false;
    }
    test() {
        this.shouldShow = false;
    }
    clickEvent() {
        this.status = !this.status;
    }
    rotate(event) {
        setTimeout(() => {
            event.classList.add("myClass");
        }, 0)
    }
    callnext() {
        this.isfiled = true;
        // this.testclass = 0;
    }
    callnext2() {
        this.isfiled2 = true;
    }

    callnext4() {
        this.isfiled4 = true;
    }
    callnext5() {
        this.isfiled5 = true;
    }
    callnext3() {
        this.isfiled3 = true;
    }
    // complete() {
    //     this.step1Completed = true;
    //     // this.stepper.next()
    //     this.isfiled3 = true;
    // }
    getPredefineDpet() {
        let login_access_token = this.currentUser.login_access_token;
        this.userService.getDeptPredefine(login_access_token).pipe(first()).subscribe(
            (data: any) => {
                this.listDeptPredefine = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }
    scrollToBottom2(): void {
        try {
            this.myScrollContainer2.nativeElement.scrollTop = this.myScrollContainer2.nativeElement.scrollHeight;
        } catch (err) { }
    }
    scrollToBottomSection(): void {
        try {
            this.myScrollContainerSection.nativeElement.scrollTop = this.myScrollContainerSection.nativeElement.scrollHeight;
        } catch (err) { }
    }

    companySettingViewSetup() {
        let login_access_token = this.currentUser.login_access_token;
        this.userService.setupCompanySetting(login_access_token, this.user_id, this.company_id).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    console.log('setupCompanySetting', data.data);
                    // data for company
                    let companyInfo = data.data.comanyInfo;
                    if (companyInfo != '') {
                        this.isfiled = true;
                        let storeUnitId = companyInfo[0].multi_unit_id;
                        this.currentUser.unit_id = storeUnitId;
                        let storeDeptId = companyInfo[0].multi_dept_id;
                        this.currentUser.dept_id = storeDeptId;
                        console.log('deppppp', this.currentUser.dept_id)
                        this.currentUser.data.profile_picture = companyInfo[0].file_name;
                        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                        this.company_step_id = companyInfo[0].company_step_id;
                        this.testclass = companyInfo[0].step_no;
                        console.log("test", this.testclass);
                        this.companyFormGroup.patchValue({ company_step_id: this.company_step_id });
                        this.companyFormGroup.patchValue({ company_id: companyInfo[0].id });
                        this.companyFormGroup.patchValue({ company_name: companyInfo[0].company_name });
                        this.companyFormGroup.patchValue({ company_address: companyInfo[0].company_address });
                        this.companyFormGroup.patchValue({
                            company_logo: companyInfo[0].file_name
                        });
                        this.companyFormGroup.patchValue({
                            image_id: companyInfo[0].image_id
                        });
                    }
                    // data for unit
                    const comUnitInfo = data.data.comanyUnit;
                    if (comUnitInfo == '') {
                        this.formArrUnits.push(this.initItemUnits());
                    }
                    else {
                        if (comUnitInfo.length > 0) {
                            this.isfiled2 = true;
                        }
                        for (let i = 0; i < comUnitInfo.length; i++) {
                            this.formArrUnits.push(this.initItemUnits());
                            this.formArrUnits.at(i).patchValue({ unit_id: comUnitInfo[i].id });
                            this.formArrUnits.at(i).patchValue({ unit_name: comUnitInfo[i].unit_name });
                            this.formArrUnits.at(i).patchValue({ unit_address: comUnitInfo[i].unit_address });
                        }
                    }
                    // data for user
                    const comUserInfo = data.data.comanyUser;
                    if (comUserInfo == '') {
                        this.formArrUsr.push(this.initItemusr());
                    }
                    else {
                        if (comUserInfo.length > 0) {
                            this.isfiled3 = true;
                        }
                        for (let i = 0; i < comUserInfo.length; i++) {
                            this.testnextstep = true;
                            this.formArrUsr.push(this.initItemusr());
                            // this.departmentGet(comUserInfo[i].unit_id);
                            console.log("edit", comUserInfo);
                            let teest = comUserInfo[i].multi_unit_id;
                            let final = teest.toString();
                            var num = parseInt(final)
                            this.formArrUsr.at(i).patchValue({ users_id: comUserInfo[i].user_id });
                            this.formArrUsr.at(i).patchValue({ name: comUserInfo[i].name });
                            this.formArrUsr.at(i).patchValue({ email: comUserInfo[i].email });
                            this.formArrUsr.at(i).patchValue({ role_id: comUserInfo[i].role_id });
                            this.formArrUsr.at(i).patchValue({ dept_id: comUserInfo[i].dept_id });
                            this.formArrUsr.at(i).patchValue({ dept_name: comUserInfo[i].dept_name });
                            this.formArrUsr.at(i).patchValue({ multi_unit_id: num });

                        }
                    }
                    // data for dept
                    const comDeptInfo = data.data.comanyDept;
                    if (comDeptInfo == '') {
                        this.formArrDept.push(this.initItemDept());
                    }
                    else {
                        if (comDeptInfo.length > 0) {
                            this.isfiled4 = true;
                        }
                        for (let i = 0; i < comDeptInfo.length; i++) {
                            this.formArrDept.push(this.initItemDept());
                            this.formArrDept.at(i).patchValue({ dept_id: comDeptInfo[i].id });
                            this.formArrDept.at(i).patchValue({ dept_name: comDeptInfo[i].dept_name });
                            this.formArrDept.at(i).patchValue({ user_id: comDeptInfo[i].user_id });
                            this.formArrDept.at(i).patchValue({ unit_id: comDeptInfo[i].unit_id });
                        }
                    }
                    // data for Section
                    const comSectionInfo = data.data.comanySection;
                    if (comSectionInfo == '') {
                        this.formArrSections.push(this.initItemSections());
                    }
                    else {
                        if (comSectionInfo.length > 0) {
                            this.isfiled5 = true;
                        }
                        for (let i = 0; i < comSectionInfo.length; i++) {
                            this.formArrSections.push(this.initItemSections());
                            this.departmentGet(comSectionInfo[i].unit_id);

                            this.formArrSections.at(i).patchValue({ section_id: comSectionInfo[i].id });
                            this.formArrSections.at(i).patchValue({ dept_id: comSectionInfo[i].dept_id });
                            this.formArrSections.at(i).patchValue({ unit_id: comSectionInfo[i].unit_id });
                            this.formArrSections.at(i).patchValue({ section_name: comSectionInfo[i].section_name });
                        }
                    }
                }
                else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
    comLogoSelected(event: any) {
        let reader = new FileReader();
        let file = event.target.files[0];
        if (event.target.files && event.target.files[0]) {
            reader.readAsDataURL(file);
            // When file uploads set it to file formcontrol
            reader.onload = () => {
                this.companyFormGroup.patchValue({
                    company_logo: reader.result
                });
            }
        }
    }
    companyProfileAdd() {
        this.submitted = true;
        if (this.companyFormGroup.invalid) {
            return;
        }
        this.companyFormGroup.value.company_step_id = this.company_step_id;
        this.userService.newCompanySetup(this.companyFormGroup.value).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    // this.companyProfileAddstep = false;
                    // console.log("testtwqa",   this.companyProfileAddstep );
                    this.alertService.success(data.message, true);
                    let compProfileData = data.data;
                    this.isfiled = true;
                    this.company_step_id = compProfileData.company_step_id;
                    this.testtwo = compProfileData.step_no;

                    this.currentUser.data.company_id = JSON.stringify(compProfileData.company_id);
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    this.company_id = this.currentUser.data.company_id;
                    this.companyFormGroup.patchValue({ company_id: compProfileData.company_id });
                    this.companyFormGroup.patchValue({ company_name: compProfileData.company_name });
                    this.companyFormGroup.patchValue({ company_address: compProfileData.company_address });
                    // this.companyFormGroup.patchValue({ company_city: compProfileData.company_city });
                    //this.companyFormGroup.patchValue({ company_state: compProfileData.company_state });
                    this.companyFormGroup.patchValue({
                        company_logo: compProfileData.company_logo
                    });
                    this.companyFormGroup.patchValue({
                        image_id: compProfileData.image_id
                    });

                }
                else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
    companyUnitsAdd() {
        this.submitted = true;
        if (this.unitFormGroup.invalid) {
            return;
        }
        this.unitFormGroup.value.company_id = this.company_id;
        this.unitFormGroup.value.company_step_id = this.company_step_id;
        const unitValues = [...this.unitFormGroup.value.itemunits];
        const storeUnitFrom = [];
        unitValues.forEach((formRow) => {
            storeUnitFrom.push({
                company_id: this.company_id,
                user_id: this.user_id,
                unit_id: formRow.unit_id,
                unit_name: formRow.unit_name,
                unit_address: formRow.unit_address,
                //unit_city: formRow.unit_city,
                //unit_state: formRow.unit_state,
            })
        });
        this.unitFormGroup.value.itemunits = storeUnitFrom;
        this.userService.newCompanySetup(this.unitFormGroup.value).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    this.alertService.success(data.message, true);
                    this.company_step_id = data.data.company_step_id;
                    let getUnitData = data.data.itemunits;
                    for (let i = 0; i < getUnitData.length; i++) {
                        this.formArrUnits.at(i).patchValue({ "unit_id": getUnitData[i].unit_id });
                    }
                    console.log("controls", this.formArrUnits.controls);


                    this.unitsGet();
                    this.isfiled2 = true;
                }
                else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
    initItemUnits() {
        return this._formBuilder.group({
            company_id: [this.company_id],
            user_id: [this.user_id],
            unit_id: [''],
            unit_name: ['', Validators.required],
            unit_address: ['', Validators.required],
            //unit_city: ['', Validators.required],
            //unit_state: ['', Validators.required]
        });
    }
    addNewUnits() {
        this.formArrUnits.push(this.initItemUnits());
    }
    get formArrUnits() {
        return this.unitFormGroup.get('itemunits') as FormArray;
    }
    deleteUnits(index: number) {
        let unitId = this.formArrUnits.value[index].unit_id;
        console.log("usr", this.formArrUnits.value[index]);
        if (unitId) {
            this.deleteOldUnit(unitId);
        }
        this.formArrUnits.removeAt(index);
    }
    deleteOldUnit(unit_id) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let user_id = this.user_id;
        this.userService.deleteUnitChange(login_access_token, unit_id, user_id).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    this.alertService.success(data.message, true);
                }
                else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }

    // test
    companyUsrAdd() {
        this.submitted = true;
        if (this.usrFormGroup.invalid) {
            console.log('invalid usrFormGroup');
            return;
        }
        this.usrFormGroup.value.company_id = this.company_id;
        this.usrFormGroup.value.company_step_id = this.company_id;
        console.log("value", this.usrFormGroup.value);

        const usrValues = [...this.usrFormGroup.value.itemUsers];
        const storeusrFrom = [];
        usrValues.forEach((formRow) => {
            storeusrFrom.push({
                company_id: this.company_id,
                name: formRow.name,
                users_id: formRow.users_id,
                email: formRow.email,
                multi_unit_id: formRow.multi_unit_id,
                role_id: '4',
                dept_id: formRow.dept_id,
                dept_name: formRow.dept_name,
                multi_dept_id: [' '],
                multi_section_id: [' '],
                password: 'Prima@123',

            })
        });
        console.log("value", storeusrFrom);
        this.usrFormGroup.value.itemUsers = storeusrFrom;
        console.log("value", this.usrFormGroup.value);

        this.userService.newCompanySetup(this.usrFormGroup.value).pipe(first()).subscribe(
            (data: any) => {

                // console.log('11111111111111111111111');
                if (data.status_code == 200) {
                    console.log('22222222222222');

                    // console.log('return from backend');
                    this.statusfailed = data.status;
                    this.testnextstep = true;
                    console.log(this.statusfailed);

                     this.selectedIndex = 3;
                    console.log(this.selectedIndex);
                    
                    // this.isCompleted = true;
                    this.alertService.success(data.message, true);
                    this.company_step_id = data.data.company_id;
                    let getUsrData = data.data.itemUsers;
                    console.log("gett", getUsrData);
                    this.userLisetGet();
                    this.isfiled3 = true;
                    for (let i = 0; i < getUsrData.length; i++) {
                        this.formArrUsr.at(i).patchValue({ "users_id": getUsrData[i].users_id });
                        this.departmentGet(getUsrData[i].multi_unit_id);
                    }
                    console.log(this.formArrUsr.controls);

                } else {

                     console.log('33333333333333');

                        //  this.selectedIndex = 3;
                        //  console.log(this.selectedIndex);

                    // if (this.statusfailed == 'failed') {
                    //     this.selectedIndex = 2;
                    // }
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                 console.log('44444444444');

                 this.selectedIndex = 2;
                
                this.alertService.error(error);
            });
    }
    initItemusr() {
        return this._formBuilder.group({
            user_id: this.user_id,
            users_id: [''],
            name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['Prima@123', Validators.required],
            // passwordConfirm: ['Prima@123'],
            role_id: ['4', Validators.required],
            dept_id: [''],
            dept_name: ['', Validators.required],
            // unit_id: ['', Validators.required],
            multi_dept_id: [' '],
            multi_section_id: [' '],
            multi_unit_id: ['', Validators.required],


        });
    }
    get formArrUsr() {
        return this.usrFormGroup.controls['itemUsers'] as FormArray
    }
    addNewUsr() {

        this.formArrUsr.push(this.initItemusr());
    }

    deleteLesson(lessonIndex: number) {

        let userID = this.formArrUsr.value[lessonIndex].users_id;
        let deptID = this.formArrUsr.value[lessonIndex].dept_id;
        console.log("deptttid", deptID);
        
        console.log("usr", this.formArrUsr.value[lessonIndex]);

        if (userID) {
            this.userDelete(userID);
        }
        if (deptID) {
            this.deleteOldDept(deptID);
        }
        this.formArrUsr.removeAt(lessonIndex);
    }
    userDelete(user_id) {
        let login_access_token = this.currentUser.login_access_token;


        this.userService.deleteSingleUser(login_access_token, user_id).pipe(first()).subscribe(
            (data: any) => {

                if (data.status_code == 200) {
                    //   this.MessageSuccess = data;
                    this.alertService.success(data.message, true);

                }
                else {

                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });


    }

    // deleteLesson(lessonIndex: number) {
    //     this.formArrUsr.removeAt(lessonIndex);
    // }
    // get formArrUsr() {
    //     // console.log("yyyy",this.formArrUsr);
    //     return this.usrFormGroup.controls['itemUsers'] as FormArray;


    // }
    // view user


    //   roles
    SelectModuleGet() {
        this.userService.GetSelectModule().pipe(first()).subscribe(
            (data: any) => {
                this.userrole = data.data.user_role;
                console.log("roles", this.userrole);

            },
            error => {
                this.alertService.error(error);
            });
    }
    // test
    companyDeptAdd() {
        this.submitted = true;
        if (this.deptFormGroup.invalid) {
            return;
        }
        this.deptFormGroup.value.company_id = this.company_id;
        this.deptFormGroup.value.company_step_id = this.company_step_id;
        const deparmentValues = [...this.deptFormGroup.value.itemDept];
        const storeDeptFrom = [];
        deparmentValues.forEach((formRow) => {
            storeDeptFrom.push({
                company_id: this.company_id,

                unit_id: formRow.unit_id,
                user_id: formRow.user_id,
                dept_id: formRow.dept_id,
                dept_name: formRow.dept_name,
            })
        });
        this.deptFormGroup.value.itemDept = storeDeptFrom;
        this.userService.newCompanySetup(this.deptFormGroup.value).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    this.alertService.success(data.message, true);
                    this.isfiled4 = true;
                    this.company_step_id = data.data.company_step_id;
                    let getDeptData = data.data.itemDept;
                    for (let i = 0; i < getDeptData.length; i++) {
                        this.formArrDept.at(i).patchValue({ "dept_id": getDeptData[i].dept_id });
                    }
                }
                else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
    initItemDept() {
        return this._formBuilder.group({
            company_id: [this.company_id],
            //  user_id: ['', Validators.required],

            unit_id: ['', Validators.required],
            user_id: ['', Validators.required],
            dept_id: [''],
            dept_name: ['', Validators.required],
            multi_dept_id: ['']
            //multi_dept_id: this._formBuilder.array([])
        });
    }
    addNewDept() {
        this.formArrDept.push(this.initItemDept());
    }
    get formArrDept() {
        return this.deptFormGroup.get('itemDept') as FormArray;
    }
    deleteDept(index: number) {
        let deptId = this.formArrDept.value[index].dept_id;
        if (deptId) {
            this.deleteOldDept(deptId);
        }
        this.formArrDept.removeAt(index);
    }
    /*   checkboxesDataList = [{ id: '1', name: 'test' },
        { id: '2', name: 'test' }
        ] */
    /* changeDeptSelection(id, index) {
        console.log('da', id, index, this.formArrDept.at(index).get('multi_dept_id').value);
        // this.formArrDept.at(index).get('multi_dept_id').value
        console.log('sadsad', this.formArrDept.at(index).value.multi_dept_id);
        //this.formArrDept.at(index).patchValue({ multi_dept_id: id });
    } */
    deleteOldDept(dept_id) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let user_id = this.user_id;
        this.userService.deleteDepartment(login_access_token, dept_id, user_id).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    this.alertService.success(data.message, true);
                }
                else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
    companySectionAdd() {
        this.submitted = true;
        if (this.sectionsFormGroup.invalid) {
            return;
        }
        this.sectionsFormGroup.value.company_id = this.company_id;
        this.sectionsFormGroup.value.company_step_id = this.company_step_id;
        const sectionsValues = [...this.sectionsFormGroup.value.itemSections];
        const storeSectionsFrom = [];
        console.log("section added");
        
        sectionsValues.forEach((formRow) => {
            storeSectionsFrom.push({
                company_id: this.company_id,
                user_id: this.user_id,
                unit_id: formRow.unit_id,
                dept_id: formRow.dept_id,
                section_id: formRow.section_id,
                section_name: formRow.section_name,
            })
        });
        this.sectionsFormGroup.value.itemSections = storeSectionsFrom;
        this.userService.newCompanySetup(this.sectionsFormGroup.value).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    this.alertService.success(data.message, true);
                    this.company_step_id = data.data.company_step_id;
                    let getSectionsData = data.data.itemSections;
                    this.isfiled5 = true;
                    for (let i = 0; i < getSectionsData.length; i++) {
                        this.formArrSections.at(i).patchValue({ "section_id": getSectionsData[i].section_id });
                    }
                    console.log("controlsection", this.formArrSections.controls);

                }
                else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
    initItemSections() {
        return this._formBuilder.group({
            user_id: [this.user_id],
            unit_id: ['', Validators.required],
            dept_id: ['', Validators.required],
            section_id: [''],
            section_name: ['', Validators.required]
        });
    }
    addNewSections() {
        this.formArrSections.push(this.initItemSections());
    }
    get formArrSections() {
        return this.sectionsFormGroup.get('itemSections') as FormArray;
    }
    deleteSections(index: number) {
        let section_id = this.formArrSections.value[index].section_id;
        if (section_id) {
            this.deleteOldSections(section_id);
        }
        this.formArrSections.removeAt(index);
    }
    deleteOldSections(section_id) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let user_id = this.user_id;
        let company_id = this.company_id;
        this.userService.deleteSection(login_access_token, section_id, user_id, company_id).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    this.alertService.success(data.message, true);
                }
                else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
    companyuserContSetAdd() {
        this.submitted = true;

        if (this.userContSetFormGroup.invalid) {
            return;
        }
        this.userContSetFormGroup.value.company_id = this.company_id;
        this.userContSetFormGroup.value.company_step_id = this.company_step_id;
        this.userService.newCompanySetup(this.userContSetFormGroup.value).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    //this.isfiled5 = true;
                    this.alertService.success(data.message, true);
                    let getuserContSetData = data.data;
                    this.company_step_id = getuserContSetData.company_step_id;
                    this.companySettingViewSetup1();
                    this.userLisetGet();
                }
                else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
    companySettingViewSetup1() {
        let login_access_token = this.currentUser.login_access_token;
        console.log("cccc", this.currentUser.id);

        this.userService.setupCompanySetting(login_access_token, this.user_id, this.company_id).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    let company_details = true;
                    this.currentUser.data.company_details = JSON.stringify(company_details);
                    let companyInfo = data.data.comanyInfo;
                    let storeUnitId = companyInfo[0].multi_unit_id;
                    this.currentUser.unit_id = storeUnitId;
                    let storeDeptId = companyInfo[0].multi_dept_id;
                    this.currentUser.dept_id = storeDeptId;
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    this.modulesPermissionGet();
                }
                else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
    modulesPermissionGet() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let role_id = this.currentUser.role_id;
        let company_id = this.currentUser.data.company_id;
        this.userService.getMenuPermission(login_access_token, role_id).pipe(first()).subscribe(
            (data: any) => {
                localStorage.setItem('userModulePermission', JSON.stringify(data.la_menu));
                /*  this.router.navigate(['/apps/event-home']);
                 location.reload(); */
                // get Company Details
                this.userService.viewCompanySetting(login_access_token, company_id).pipe(first()).subscribe((data: any) => {
                    localStorage.setItem('allDetailsCompany', JSON.stringify(data.data));
                    this.router.navigate(['/apps/event-home']);
                    location.reload();
                },
                    error => {
                        this.alertService.error(error);
                    });
            },
            error => {
                this.alertService.error(error);
            });
    }
    unitsGet() {
        let login_access_token = this.currentUser.login_access_token;
        //let company_id = this.currentUser.data.company_id;
        this.userService.getUnitChange(login_access_token, this.company_id).pipe(first()).subscribe(
            (data: any) => {
                this.unitsData = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    departmentGet(event: any) {
        let unit_id = event;
        let profile = 'section';
        this.userService.getDepartmentMultiUnit(unit_id, profile).pipe(first()).subscribe(
            (data: any) => {
                this.dataDepartment = data.data;
                console.log('dept', this.dataDepartment);
                if (this.dataDepartment.length == 0) {
                    alert("You have not created Department for this unit, please go to Step 3 and create Department");
                }
            },
            error => {
                this.alertService.error(error);
            });
    }


    userLisetGet() {
        let login_access_token = this.currentUser.login_access_token;
        let role_id = this.currentUser.role_id;
        let company_id = this.currentUser.data.company_id;
        this.userService.getAllUserList(login_access_token, role_id, company_id).pipe(first()).subscribe((data: any) => {
            this.userListAllData = data.data;
            console.log("test-userdetial", this.userListAllData);

        },
            error => {
                this.alertService.error(error);
            });
    }
}
