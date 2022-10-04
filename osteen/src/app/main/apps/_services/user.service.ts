import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { environment } from 'environments/environment';
const API_URL = environment.apiurl;
// const httpOptions = {
//   headers: new HttpHeaders({
//     'Access-Control-Allow-Origin': '*',
//     'Authorization': 'authkey',


//   })
// };
const headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Authorization', 'authkey',)
  .set('Access-Control-Allow-Origin', '*');
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  claimPivotPaymentReport(PayorType: string) {
    //return this.http.post(`${API_URL}/findClaimPivotPaymentReport`, {PayorType:PayorType});
    return this.http.post(`https://reports.summit-derm.com:4000/findClaimPivotPaymentReport`, { PayorType: PayorType });
  }

  newCompanySetup(data: any) {
    return this.http.post(`${API_URL}/api-new-company-setup`, data);
  }
  setupCompanySetting(login_token: string, user_id: any, company_id: any) {
    return this.http.post(`${API_URL}/api-view-new-company-setup`, { login_access_token: login_token, user_id: user_id, company_id: company_id });
  }
  viewCompanySetting(login_token: string, company_id: number) {
    return this.http.post(`${API_URL}/api-company-setting-view`, { login_access_token: login_token, company_id: company_id });
  }

  /*  addCompanySetting(data: any) {
     return this.http.post(`${API_URL}/api-company-profile`, data);
   } */
  addCompanySetting(data: any) {
    return this.http.post(`${API_URL}/api-company-setting-update`, data);
  }
  register(user: any) {
    return this.http.post(`${API_URL}/api-user-signup`, user).map(data => data);
  }
  signupByFile(data: FormData) {
    // console.log("formdata",data);
    
    return this.http.post(`${API_URL}/api-user-signup-file`, data);
  }
  login(userlogin: any) {

    return this.http.post(`${API_URL}/api-user-login`, userlogin, { 'headers': headers });
  }
  forgotPassword(email: any) {
    return this.http.post(`${API_URL}/api-reset-password`, email);
  }
  resetPassword(data: any) {
    return this.http.post(`${API_URL}/api-resetpassword-update`, data);
  }
  reminderActionPlan(login_token: string, unitId: string, companyId: string, deptAlot: any, userID: any) {
    return this.http.post(`${API_URL}/api-strobj-review`, { login_access_token: login_token, unit_id: unitId, company_id: companyId, dept_alot: deptAlot, user_id: userID });
  }
  reminderKPI(login_token: string, company_id: number, reminder_date: number, reminder_frequency: number, financial_year: string,dept_id:number, unit_id: number) {
    return this.http.post(`${API_URL}/api-dashboard-review-actual-data`, { login_access_token: login_token, company_id: company_id, reminder_date: reminder_date, reminder_frequency: reminder_frequency, financial_year: financial_year,dept_id:dept_id, unit_id: unit_id });
  }
  getDepartmentUnit(login_token: string, currentUnitId: string, role_id: any, dept_id: string) {
    return this.http.post(`${API_URL}/api-get-department`, { login_access_token: login_token, unit_id: currentUnitId,role_id: role_id, dept_id: dept_id });
  }
  getAllDepartment(login_token:string, unit_id: number){
    return this.http.post(`${API_URL}/api-get-all-department`, { login_access_token: login_token, unit_id: unit_id});
  }
  getDepartmentMultiUnit(currentUnitId: string, profile: string) {
    return this.http.post(`${API_URL}/api-get-dept-signup`, { unit_id: currentUnitId, profile: profile });
  }
  getUserUnitWise(login_token:string, unit_id: number,company_id: number)
  {
    return this.http.post(`${API_URL}/api-get-user-details-unit-wise`, {login_access_token: login_token, unit_id: unit_id, company_id: company_id });
  }
  getSectionDepartment(dept_id: string, company_id: number) {
    return this.http.post(`${API_URL}/get-section`, { dept_id: dept_id, company_id: company_id });
  }
  getSectionMultiDept(dept_id: string, profile: string) {
    return this.http.post(`${API_URL}/api-get-section-signup`, { dept_id: dept_id, profile: profile });
  }
  ChangePassword(data: any) {
    return this.http.post(`${API_URL}/api-change-password`, data);
  }
  profileEdit(data: any) {
    return this.http.post(`${API_URL}/api-update-profile`, data);
  }
  userPictureUpload(data: FormData) {
    return this.http.post(`${API_URL}/api-update-profile-picture`, data);
  }
  singleUserDetails(login_token: string, company_id: any, user_id: number) {
    return this.http.post(`${API_URL}/api-get-single-user-details`, { login_access_token: login_token, company_id: company_id, user_id: user_id });
  }
  GetUserProfile(login_access_token: string, role_id: number, user_id: number) {
    return this.http.post(`${API_URL}/api-view-profile`, { login_access_token: login_access_token, role_id: role_id, user_id: user_id });
  }
  getModulesPermission(login_token: string, role_id: number) {
    return this.http.post(`${API_URL}/api-get-module`, { login_access_token: login_token, role_id: role_id });
  }
  getMenuPermission(login_token: string, role_id: number) {
    return this.http.post(`${API_URL}/api-get-menu`, { login_access_token: login_token, role_id: role_id });
  }
  getModuleroles(login_token: string, id: number) {
    return this.http.post(`${API_URL}/api-get-module-data`, { login_access_token: login_token, id: id });
  }
  permissionsRoleData(module_permissions: any, login_access_token: string, role_id: number) {
    return this.http.post(`${API_URL}/api-update-role-module`, { module_permissions: module_permissions, login_access_token: login_access_token, role_id: role_id });
  }
  getAllUserList(login_token: string, role_id: number, company_id: any) {
    return this.http.post(`${API_URL}/api-get-user-details`, { login_access_token: login_token, role_id: role_id, company_id: company_id });
  }
  getAllUserByProfileGroupId(login_token: string, role_id: number, group_id: number) {
    return this.http.post(`${API_URL}/api-get-profile-user-by-group-id`, { login_access_token: login_token, role_id: role_id, group_id: group_id });
  }
  getGroupDetails(login_token: string, group_id: number) {
    return this.http.post(`${API_URL}/api-get-profile-group-details`, { login_access_token: login_token,group_id: group_id });
  }
 
  getAllPost(login_token: string,user_id:number, group_id: number, company_id: number) {
    return this.http.post(`${API_URL}/api-get_post`, { login_access_token: login_token,user_id: user_id, group_id: group_id, company_id: company_id});
  }

  createPost(data: any) {
    return this.http.post(`${API_URL}/api-create_post`, data);
  }

  deleteSingleUser(login_token: string, user_id: number) {
    return this.http.post(`${API_URL}/api-delete-user`, { login_access_token: login_token, user_id: user_id });
  }
  getUnitChange(login_token: string, company_id: number) {
    return this.http.post(`${API_URL}/api-view-unit`, { login_access_token: login_token, company_id: company_id });
  }
  addUnitChange(data: FormData) {
    return this.http.post(`${API_URL}/api-unit`, data);
  }
  editUnitChange(data: FormData) {
    return this.http.post(`${API_URL}/api-edit-unit`, data);
  }
  deleteUnitChange(login_token: string, unit_id: number, user_id: any) {
    return this.http.post(`${API_URL}/api-delete-unit`, { login_access_token: login_token, unit_id: unit_id, user_id: user_id });
  }
  getDepartmentChange(login_token: string, company_id: number) {
    return this.http.post(`${API_URL}/api-view-department`, { login_access_token: login_token, company_id: company_id });
  }
  addDepartmentChange(data: any) {
    return this.http.post(`${API_URL}/api-department`, data);
  }
  editDepartmentChange(data: FormData) {
    return this.http.post(`${API_URL}/api-edit-department`, data);
  }
  deleteDepartment(login_token: string, dept_id: number, user_id: any) {
    return this.http.post(`${API_URL}/api-delete-department`, { login_access_token: login_token, dept_id: dept_id, user_id: user_id });
  }
  getDeptPredefine(login_token: string) {
    return this.http.post(`${API_URL}/api-get-predefine-dept`, { login_access_token: login_token });
  }
  getSectionChange(login_token: string, company_id: number) {
    return this.http.post(`${API_URL}/api-view-section`, { login_access_token: login_token, company_id: company_id });
  }
  addSectionChange(data: FormData) {
    return this.http.post(`${API_URL}/api-section`, data);
  }
  editSectionChange(data: FormData) {
    return this.http.post(`${API_URL}/api-section-update`, data);
  }
  deleteSection(login_token: string, section_id: number, user_id: any, company_id: any) {
    return this.http.post(`${API_URL}/api-delete-section`, { login_access_token: login_token, section_id: section_id, user_id: user_id, company_id: company_id });
  }
  getCategoryChange(login_token: string, company_id: number) {
    return this.http.post(`${API_URL}/api-view-category`, { login_access_token: login_token, company_id: company_id });
  }
  addCategoryChange(data: FormData) {
    return this.http.post(`${API_URL}/api-add-category`, data);
  }
  editCategoryChange(data: FormData) {
    return this.http.post(`${API_URL}/api-update-category`, data);
  }
  deleteCategory(login_token: string, category_id: number) {
    return this.http.post(`${API_URL}/api-delete-category`, { login_access_token: login_token, category_id: category_id });
  }
  getBusinessChange(login_token: string, company_id: number) {
    return this.http.post(`${API_URL}/api-view-business_initiatives`, { login_access_token: login_token, company_id: company_id });
  }
  addBusinessChange(data: FormData) {
    return this.http.post(`${API_URL}/api-add-business_initiatives`, data);
  }
  editBusinessChange(data: FormData) {
    return this.http.post(`${API_URL}/api-update-business_initiatives`, data);
  }
  deleteBusiness(login_token: string, business_initiatives_id: number) {
    return this.http.post(`${API_URL}/api-delete-business_initiatives`, { login_access_token: login_token, business_initiatives_id: business_initiatives_id });
  }
  getUnitOfMeasurement(login_token: string, company_id: number) {
    return this.http.post(`${API_URL}/api-view-uom`, { login_access_token: login_token, company_id: company_id });
  }
  addUomChange(data: FormData) {
    return this.http.post(`${API_URL}/api-add-uom`, data);
  }
  editUomChange(data: FormData) {
    return this.http.post(`${API_URL}/api-update-uom`, data);
  }
  deleteUom(login_token: string, uom_id: number) {
    return this.http.post(`${API_URL}/api-delete-uom`, { login_access_token: login_token, uom_id: uom_id });
  }
  getPriorityChange(login_token: string, company_id: number) {
    return this.http.post(`${API_URL}/api-view-priorities`, { login_access_token: login_token, company_id: company_id });
  }
  addPriorityChange(data: FormData) {
    return this.http.post(`${API_URL}/api-add-priorities`, data);
  }
  editPriorityChange(data: FormData) {
    return this.http.post(`${API_URL}/api-update-priorities`, data);
  }
  deletePriority(login_token: string, id: number) {
    return this.http.post(`${API_URL}/api-delete-priorities`, { login_access_token: login_token, id: id });
  }
  addBusinessFaq(data: FormData) {
    return this.http.post(`${API_URL}/api-add-faq`, data);
  }
  businessFaqGet(login_token: string, company_id: number) {
    return this.http.post(`${API_URL}/api-view-faq`, { login_access_token: login_token, company_id: company_id });
  }
  editFaqChange(data: FormData) {
    return this.http.post(`${API_URL}/api-update-faq`, data);
  }
  deleteFaq(login_token: string, faq_id: number) {
    return this.http.post(`${API_URL}/api-delete-faq`, { login_access_token: login_token, faq_id: faq_id });
  }
  GetSelectModule() {
    return this.http.get(`${API_URL}/api-get-select-modules`);
  }
  getMultiUnits(login_access_token: string, unit_id: number) {
    return this.http.post(`${API_URL}/api-get-unit`, { login_access_token: login_access_token, unit_id: unit_id });
  }
  getSection(login_token: string, dept_id: string, company_id: number) {
    return this.http.post(`${API_URL}/get-section`, { login_access_token: login_token, dept_id: dept_id, company_id: company_id });
  }
  tasksDashboardView(login_token: string, currentUnitId: string, role_id: any, dept_id: number, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/api-view-task-dashboard`, { login_access_token: login_token, unit_id: currentUnitId, role_id: role_id, dept_graph_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  TasksView(login_token: string, currentUnitId: string, role_id: any, dept_id: number, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/api-view-tasks`, { login_access_token: login_token, unit_id: currentUnitId, role_id: role_id, dept_graph_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  /* getTotalTaskData(login_token: string,currentUnitId: string) {
      return this.http.post(`${API_URL}/get-task-dashboard-data`,{login_access_token:login_token,unit_id:currentUnitId});
   }*/
  TaskAdd(data: any) {
    return this.http.post(`${API_URL}/api-add-tasks`, data);
  }
  TasksDelete(login_token: string, task_id: number, user_id: number) {
    return this.http.post(`${API_URL}/api-delete-tasks`, { login_access_token: login_token, task_id: task_id, user_id: user_id });
  }
  TaskEdit(data: any) {
    return this.http.post(`${API_URL}/api-edit-tasks`, data);
  }
  TaskStatusSumit(data: FormData) {
    return this.http.post(`${API_URL}/api-remark-tasks`, data);
  }
  tasksDetailsSingle(login_token: string, tasks_id: number) {
    return this.http.post(`${API_URL}/api-view-tasks-details`, { login_access_token: login_token, tasks_id: tasks_id });
  }
  taskStatusSingle(login_token: string, task_id: number, statusid: number, user_id: number, unit_id: string) {
    return this.http.post(`${API_URL}/api-edit-tasks`, { login_access_token: login_token, task_id: task_id, status_id: statusid, user_id: user_id, unit_id: unit_id });
  }
  ViewTasksrRmark(login_token: string, tasks_id: number) {
    return this.http.post(`${API_URL}/api-view-tasks-remark`, { login_access_token: login_token, tasks_id: tasks_id });
  }
  EditTasksrRmark(data: FormData) {
    return this.http.post(`${API_URL}/api-edit-tasks-remark`, data);
  }
  AddTasksrRmark(data: FormData) {
    return this.http.post(`${API_URL}/api-remark-tasks`, data);
  }
  AddEditDeleteIssueRmark(data: FormData) {
    return this.http.post(`${API_URL}/api-issue-tracker-remark`, data);
  }
  DeleteTasksrRmark(login_token: string, task_remark_id: number, task_user_id: number, user_id: number) {
    return this.http.post(`${API_URL}/api-delete-tasks-remark`, { login_access_token: login_token, task_remark_id: task_remark_id, task_user_id: task_user_id, user_id: user_id });
  }
  ViewTasksFiles(login_token: string, tasks_id: number) {
    return this.http.post(`${API_URL}/api-view-tasks-remark-file`, { login_access_token: login_token, tasks_id: tasks_id });
  }
  DeleteTasksFiles(login_token: string, tasks_files_id: number, task_user_id: number, user_id: number) {
    return this.http.post(`${API_URL}/api-delete-tasks-remark-file`, { login_access_token: login_token, tasks_files_id: tasks_files_id, task_user_id: task_user_id, user_id: user_id });
  }
  ProjectsView(login_token: string, unit_id: string, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/api-view-projects`, { login_access_token: login_token, unit_id: unit_id, year: selectedYear, fyear: financialYear });
  }
  pojectDashboardDataGet(login_access_token: string, unit_id: string, company_id: string, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/api-view-poject-dashboard`, { login_access_token: login_access_token, unit_id: unit_id, company_id: company_id, year: selectedYear, fyear: financialYear });
  }
  ProjectAdd(data: any) {
    return this.http.post(`${API_URL}/api-projects`, data);
  }
  ProjectUpdate(data: any) {
    return this.http.post(`${API_URL}/api-update-single-project`, data)
  }
  proDeleteSingle(data: any) {
    return this.http.post(`${API_URL}/api-delete-single-project`, data);
  }
  ProjectDelete(login_token: string, project_id: number, user_id: number, project_user_id: number) {
    return this.http.post(`${API_URL}/api-delete-projects`, { login_access_token: login_token, project_id: project_id, user_id: user_id, project_user_id: project_user_id });
  }
  singleProjectsView(login_token: string, unit_id: string, project_id: number) {
    return this.http.post(`${API_URL}/api-view-single-project`, { login_access_token: login_token, unit_id: unit_id, project_id: project_id });
  }
  synchronizeStepper(selectedIndex: number) {
    return this.http.post(`${API_URL}/api-projects`, { selectedIndex: selectedIndex });

  }
  singleRowData(login_token: string, issueId: number, projectDetails: string) {
    return this.http.post(`${API_URL}/api-view-single-row-data`, { login_access_token: login_token, issue_id: issueId, projectDetails: projectDetails });
  }
  allProDashboardData(company_id: string, login_token: string, unit_id: string, project_id: string, user_id: any) {
    return this.http.post(`${API_URL}/api-poject-view-graph`, { company_id: company_id, login_access_token: login_token, unit_id: unit_id, project_id: project_id, user_id: user_id });
  }
  ProjectStatusSumit(data: FormData) {
    return this.http.post(`${API_URL}/api-remark-projects`, data);
  }
  proDetailsSingle(login_token: string, project_id: number) {
    return this.http.post(`${API_URL}/api-view-projects-details`, { login_access_token: login_token, project_id: project_id });
  }
  ViewProjectRmark(login_token: string, project_id: number) {
    return this.http.post(`${API_URL}/api-view-projects-remark`, { login_access_token: login_token, project_id: project_id });
  }
  AddProjectRmark(data: FormData) {
    return this.http.post(`${API_URL}/api-remark-projects`, data);
  }
  DeleteProjectRmark(login_token: string, project_remark_id: number, user_id: number, project_user_id: any) {
    return this.http.post(`${API_URL}/api-delete-projects-remark`, { login_access_token: login_token, project_remark_id: project_remark_id, user_id: user_id, project_user_id: project_user_id });
  }
  EditProjectRmark(data: FormData) {
    return this.http.post(`${API_URL}/api-edit-projects-remark`, data);
  }
  ViewProjectFiles(login_token: string, project_id: number) {
    return this.http.post(`${API_URL}/api-view-projects-remark-file`, { login_access_token: login_token, project_id: project_id });
  }
  DeleteProjectFiles(login_token: string, project_files_id: number, user_id: number, project_user_id: any) {
    return this.http.post(`${API_URL}/api-delete-projects-remark-file`, { login_access_token: login_token, project_files_id: project_files_id, user_id: user_id, project_user_id: project_user_id });
  }
  taskForMeView(login_token: string, task_create_me: string) {
    return this.http.post(`${API_URL}/api-view-tasks`, { login_access_token: login_token, task_create_me: task_create_me });
  }
  taskAssignMeView(login_token: string, task_assign_me: string) {
    return this.http.post(`${API_URL}/api-view-tasks`, { login_access_token: login_token, task_assign_me: task_assign_me });
  }
  kpiDashboardDataView(login_token: string, unit_id: string, role_id: any, dept_id: any, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/view-kpi-dashboard`, { login_access_token: login_token, unit_id: unit_id, role_id: role_id, dept_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  leadKpiDashboardView(login_token: string, unit_id: string, role_id: any, dept_id: any, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/view-lead-kpi-dashboard`, { login_access_token: login_token, unit_id: unit_id, role_id: role_id, dept_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  leadKpiDataView(login_token: string, unit_id: string, role_id: any, dept_id: any, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/api-view-lead-kpi-trackers-track`, { login_access_token: login_token, unit_id: unit_id, role_id: role_id, dept_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  kpiAddSubmit(data: any) {
    return this.http.post(`${API_URL}/api-kpi-trackers`, data);
  }
  GroupCreateSubmit(data: any) {
    return this.http.post(`${API_URL}/api-create-group`, data);
  }
  ParticipantAddSubmit(data: any) {
    return this.http.post(`${API_URL}/api-add-participant-to-group`, data);
  }
  ShowJoinedGroups(login_token: string, company_id: any) {
    return this.http.post(`${API_URL}/api-view-profile-joined-group`, { login_access_token: login_token, company_id: company_id });
  }
  KpiDataView(login_token: string, unit_id: string, role_id: any, dept_id: any, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/api-view-kpi-trackers`, { login_access_token: login_token, unit_id: unit_id, role_id: role_id, dept_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  KpiEditSubmit(data: any) {
    return this.http.post(`${API_URL}/api-edit-kpi-trackers`, data);
  }
  groupEditSubmit(data: any) {
    return this.http.post(`${API_URL}/api-edit-profile-group-update`, data);
  }
  KpiDataDelete(login_token: string, kpi_id: number, user_id: number) {
    return this.http.post(`${API_URL}/api-delete-kpi-trackers`, { login_access_token: login_token, kpi_id: kpi_id, user_id: user_id });
  }

  DeleteGroupById(login_token: string, group_id: number) {
    return this.http.post(`${API_URL}/api-profile-delete-group`, { login_access_token: login_token, group_id: group_id });
  }
  kpiView(login_token: string, unit_id: string, role_id: any, dept_id: any, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/api-view-kpi-trackers-track`, { login_access_token: login_token, unit_id: unit_id, role_id: role_id, dept_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  kpiGraphDataView(login_token: string, unit_id: string, role_id: any, dept_id: number, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/api-view-kpi-trackers-track`, { login_access_token: login_token, unit_id: unit_id, role_id: role_id, dept_graph_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  kpiGraphDataViewByKpi(login_token: string, unit_id: string, role_id: any, kpi_id: any, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/api-view-kpi-trackers-track`, { login_access_token: login_token, unit_id: unit_id, role_id: role_id, kpi_id: kpi_id, year: selectedYear, fyear: financialYear });
  }
  getkpiTargetActual(login_token: string, company_id: number, kpi_id: number, year: any) {
    return this.http.post(`${API_URL}/api-new-kpi-trackers-track`, { login_access_token: login_token, company_id: company_id, kpi_id: kpi_id, select_year: year });
  }
  viewActualLateEntry(login_token: string,kpi_id: number) {
    return this.http.post(`${API_URL}/api-view-kpi-actuals-lateentry`, {login_access_token: login_token, kpi_id: kpi_id});
  }
  editkpiTargetActual(data: any) {
    return this.http.post(`${API_URL}/api-target-actual-update`, data);
  }
  getBusinessPriority(login_token: string, selectedYear: any, financialYear: any, Company_id: any) {
    return this.http.post(`${API_URL}/api-view-business-priority`, { login_access_token: login_token, year: selectedYear, fyear: financialYear, company_id: Company_id });
  }
  addBusinessPriority(data: FormData) {
    return this.http.post(`${API_URL}/api-add-business-priority`, data);
  }
  editBusinessPriority(data: FormData) {
    return this.http.post(`${API_URL}/api-update-business-priority`, data);
  }
  deleteBusinessPriority(login_token: string, priority_id: number) {
    return this.http.post(`${API_URL}/api-delete-business-priority`, { login_access_token: login_token, business_priority_id: priority_id });
  }
  getBusinessObj(login_token: string, selectedYear: any, financialYear: any, Company_id: any) {
    return this.http.post(`${API_URL}/api-view-business-objective`, { login_access_token: login_token, year: selectedYear, fyear: financialYear, company_id: Company_id });
  }
  addBusinessObj(data: FormData) {
    return this.http.post(`${API_URL}/api-add-business-objective`, data);
  }
  editBusinessObj(data: FormData) {
    return this.http.post(`${API_URL}/api-update-business-objective`, data);
  }
  deleteBusinessObj(login_token: string, objective_id: number) {
    return this.http.post(`${API_URL}/api-delete-business-objective`, { login_access_token: login_token, business_objective_id: objective_id });
  }
  getStrengths(login_token: string, selectedYear: any, financialYear: any, unit_id: any, Company_id: any) {
    return this.http.post(`${API_URL}/api-view-strength`, { login_access_token: login_token, year: selectedYear, fyear: financialYear,unit_id: unit_id, company_id: Company_id });
  }
  addStrengths(data: FormData) {
    return this.http.post(`${API_URL}/api-add-strength`, data);
  }
  editStrengths(data: FormData) {
    return this.http.post(`${API_URL}/api-update-strength`, data);
  }
  deleteStrengths(login_token: string, strength_id: number) {
    return this.http.post(`${API_URL}/api-delete-strength`, { login_access_token: login_token, strength_id: strength_id });
  }
  getOpportunity(login_token: string, selectedYear: any, financialYear: any, unit_id: any, Company_id: any) {
    return this.http.post(`${API_URL}/api-view-opportunities`, { login_access_token: login_token, year: selectedYear, fyear: financialYear, unit_id: unit_id, company_id: Company_id });
  }
  addOpportunity(data: FormData) {
    return this.http.post(`${API_URL}/api-add-opportunities`, data);
  }
  editOpportunity(data: FormData) {
    return this.http.post(`${API_URL}/api-update-opportunities`, data);
  }
  deleteOpportunity(login_token: string, opportunities_id: number) {
    return this.http.post(`${API_URL}/api-delete-opportunities`, { login_access_token: login_token, opportunities_id: opportunities_id });
  }
  getWeakness(login_token: string, selectedYear: any, financialYear: any, unit_id: any, Company_id: any) {
    return this.http.post(`${API_URL}/api-view-weaknesses`, { login_access_token: login_token, year: selectedYear, fyear: financialYear, unit_id: unit_id, company_id: Company_id });
  }
  addWeakness(data: FormData) {
    return this.http.post(`${API_URL}/api-add-weaknesses`, data);
  }
  editWeakness(data: FormData) {
    return this.http.post(`${API_URL}/api-update-weaknesses`, data);
  }
  deleteWeakness(login_token: string, weaknesses_id: number) {
    return this.http.post(`${API_URL}/api-delete-weaknesses`, { login_access_token: login_token, weaknesses_id: weaknesses_id });
  }
  getThreats(login_token: string, selectedYear: any, financialYear: any, unit_id: any, Company_id: any) {
    return this.http.post(`${API_URL}/api-view-threats`, { login_access_token: login_token, year: selectedYear, fyear: financialYear, unit_id: unit_id, company_id: Company_id });
  }
  addThreats(data: FormData) {
    return this.http.post(`${API_URL}/api-add-threats`, data);
  }
  editThreats(data: FormData) {
    return this.http.post(`${API_URL}/api-update-threats`, data);
  }
  deleteThreats(login_token: string, threats_id: number) {
    return this.http.post(`${API_URL}/api-delete-threats`, { login_access_token: login_token, threats_id: threats_id });
  }
  strategicDashboardView(login_token: string, unit_id: string, role_id: any, dept_id: any, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/view-strategic-objectives-dash`, { login_access_token: login_token, unit_id: unit_id, role_id: role_id, dept_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  strategicGraphView(login_token: string, userSelectedYear:any,companyFinancialYear:any, unit_id: string, role_id: any, dept_id: any) {
    return this.http.post(`${API_URL}/api-str-obj-grandchart`, { login_access_token: login_token, year:userSelectedYear,fyear: companyFinancialYear, unit_id: unit_id, role_id: role_id, dept_id: dept_id });
  }

  projectChartView(login_token: string, project_id: any) {
    return this.http.post(`${API_URL}/api-view-poject-gantt-chart-data`, { login_access_token: login_token, project_id: project_id });
  }

  StrategicDataView(login_token: string, unit_id: string, role_id: any, dept_id: any, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/api-view-strategic-objectives`, { login_access_token: login_token, unit_id: unit_id, role_id: role_id, dept_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  StrategicGroupStatusView(login_token: string, element:any) {
    return this.http.post(`${API_URL}/api-view-strategic-objectives-status-bygroup`, { login_access_token: login_token, element:element});
  }
  
  strategicAddSubmit(data: any ) {
    return this.http.post(`${API_URL}/api-strategic-objectives`, data);
  }
  addSoSno(company_id: any, unit_id:any,total_dept: any, dept_id: any,login_token: string) {
    return this.http.post(`${API_URL}/api-so-sno`, {company_id:company_id, unit_id: unit_id, total_dept:total_dept,dept_id:dept_id, login_access_token: login_token});
  }

  objectivesStepsAdd(data: any) {
    return this.http.post(`${API_URL}/api-add-objectives-steps`, data);
  }
  objectivesStepsGet( unit_id: any, company_id: number, user_id: any) {
    return this.http.post(`${API_URL}/api-get-objectives-steps`, {unit_id: unit_id, company_id: company_id, user_id: user_id });
  }

  StrategicDataDelete(login_token: string, strategic_objectives_id: number, user_id: number) {
    return this.http.post(`${API_URL}/api-delete-strategic-objectives`, { login_access_token: login_token, strategic_objectives_id: strategic_objectives_id, user_id: user_id });
  }
  StrategicEditSubmit(data: any) {
    return this.http.post(`${API_URL}/api-edit-strategic-objectives`, data);
  }
  getUserCommentStrObj(login_token: string, str_obj_id: number) {
    return this.http.post(`${API_URL}/api-strobj-update-comment`, { login_access_token: login_token, str_obj_id: str_obj_id });
  }
  getStrObjStatus(login_token: string) {
    return this.http.post(`${API_URL}/get-str-obj-status`, { login_access_token: login_token });
  }
  VisionDataView(login_token: string, company_id: number) {
    return this.http.post(`${API_URL}/api-view-business-plans`, { login_access_token: login_token, company_id: company_id });
  }
  VisionDataEdit(data: any) {
    return this.http.post(`${API_URL}/api-edit-business-plans`, data);
  }
  VisionDataAdd(data: any) {
    return this.http.post(`${API_URL}/api-business-plans`, data);
  }
  getStrategicObj(login_token: string, unit_id: string, dept_id: number, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/get-strategic-objectives`, { login_access_token: login_token, unit_id: unit_id, dept_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  getKpi(login_token: string, unit_id: string, dept_id: number) {
    return this.http.post(`${API_URL}/api-get-kpi`, { login_access_token: login_token, unit_id: unit_id, dept_id: dept_id });
  }
  strategicObjectivesData(login_token: string, unit_id: string, role_id: any, dept_id: any, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/strategic-objectives-data`, { login_access_token: login_token, unit_id: unit_id, role_id: role_id, dept_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  strObjeSingleStrData(login_token: string, unit_id: string, role_id: any, dept_id: any, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/strategic-objectives-data`, { login_access_token: login_token, unit_id: unit_id, role_id: role_id, dept_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  strObjeSingleStrDataFlow(login_token: string, s_o_id: number, selectedYear: any, unit_id: any) {
    return this.http.post(`${API_URL}/api-flow-chart-strategic-objectives-data`, { login_access_token: login_token, s_o_id: s_o_id, year: selectedYear, unit_id: unit_id });
  }

  strObjeSingleStrData11(login_token: string, s_o_id: number, selectedYear: any, unit_id: any) {
    return this.http.post(`${API_URL}/api-dash-board-strategic-objectives-data`, { login_access_token: login_token, s_o_id: s_o_id, year: selectedYear, unit_id: unit_id });
  }
  getStrObjActionByYear(login_token: string, actionPlanId: number, selectYear: number, fyear: number) {
    return this.http.post(`${API_URL}/api-action-plan-schedule-data`, { login_access_token: login_token, action_plan_id: actionPlanId, year: selectYear, fyear: fyear });
  }
  changeReview(data: any) {
    return this.http.post(`${API_URL}/add-action-plan-schedules`, data);
  }
  getUserComment(login_token: string, action_plan_id: number, co_owner_id: number) {
    return this.http.post(`${API_URL}/action-plan-schedules-user`, { login_access_token: login_token, action_plan_id: action_plan_id, co_owner_id: co_owner_id });
  }
  getInitiatives(login_token: string, unit_id: string, s_o_id: string, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/get-initiatives`, { login_access_token: login_token, unit_id: unit_id, s_o_id: s_o_id, year: selectedYear, fyear: financialYear });
  }
  getActionPlans(login_token: string, unit_id: string, initiatives_id: string) {
    return this.http.post(`${API_URL}/api-get-actionplans`, { login_access_token: login_token, unit_id: unit_id, initiatives_id: initiatives_id });
  }
  getActionPlansComment(login_token: string, action_plan_id: number) {
    return this.http.post(`${API_URL}/api-action-plan-comment`, { login_access_token: login_token, action_plan_id: action_plan_id });
  }
  getKpiByAction(login_token: string, unit_id: string, kpi_id: string) {
    return this.http.post(`${API_URL}/api-get-kpi-actionplan`, { login_access_token: login_token, unit_id: unit_id, kpi_id: kpi_id });
  }
  initiativeAdd(data: any) {
    return this.http.post(`${API_URL}/api-add-initiatives`, data);
  }
  initiativeEdit(data: any) {
    return this.http.post(`${API_URL}/edit-initiative`, data);
  }
  initiativeDelete(login_token: string, initiatives_id: number, user_id: number) {
    return this.http.post(`${API_URL}/delete-initiative`, { login_access_token: login_token, initiatives_id: initiatives_id, user_id: user_id });
  }
  initiativeView(login_token: string, unit_id: string, company_id: string, role_id: any, dept_id: any, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/api-view-initiative`, { login_access_token: login_token, unit_id: unit_id,company_id: company_id, role_id: role_id, dept_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  getUserCommentInitiatives(login_token: string, initiatives_id: number) {
    return this.http.post(`${API_URL}/api-initiatives-update-comment`, { login_access_token: login_token, initiatives_id: initiatives_id });
  }
  addActionPlans(data) {
    return this.http.post(`${API_URL}/api-add-action-plans`, data);
  }
  editActionPlan(data: any) {
    return this.http.post(`${API_URL}/edit-action-plan`, data);
  }
  actionPlanDelete(login_token: string, action_plan_id: number, user_id: number) {
    return this.http.post(`${API_URL}/delete-action-plan`, { login_access_token: login_token, action_plan_id: action_plan_id, user_id: user_id });
  }
  actionPlanView(login_token: string, unit_id: string, role_id: any, dept_id: any, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/initiative-and-actionplan`, { login_access_token: login_token, unit_id: unit_id, role_id: role_id, dept_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  getUserCommentActionPlans(login_token: string, action_plan_id: number) {
    return this.http.post(`${API_URL}/api-action-plan-update-comment`, { login_access_token: login_token, action_plan_id: action_plan_id });
  }
  addHoshinKanri(data: any) {
    return this.http.post(`${API_URL}/api-add-hoshinkanri`, data);
  }
  hoshinKanriView(login_token: string, unit_id: string, role_id: any, dept_id: any) {
    return this.http.post(`${API_URL}/api-view-hoshinkanri`, { login_access_token: login_token, unit_id: unit_id, role_id: role_id, dept_id: dept_id });
  }
  typePerformanceKpi(login_access_token: string) {
    return this.http.post(`${API_URL}/api-get-kpi-performance-dash`, { login_access_token: login_access_token });
  }
  performanceKpiData(login_token: string, unit_id: string) {
    return this.http.post(`${API_URL}/api-view-kpi-performance`, { login_access_token: login_token, unit_id: unit_id });
  }
  performanceTypeChange(data: FormData) {
    return this.http.post(`${API_URL}/api-update-performance-kpi`, data);
  }
  performanceKpiDashboard(login_token: string, unit_id: string, dept_id:any, selectedYear: any, financialYear: any) {
    return this.http.post(`${API_URL}/api-view-performance-kpi-dashboard`, { login_access_token: login_token, unit_id: unit_id, dept_id: dept_id, year: selectedYear, fyear: financialYear });
  }
  perforKpiStatusdView(login_token: string, unit_id: string) {
    return this.http.post(`${API_URL}/api-view-performance-status-kpi-dashboard`, { login_access_token: login_token, unit_id: unit_id });
  }
  quarterlySummaryAdd(data: any) {
    return this.http.post(`${API_URL}/quarterly-add-manufacturing`, data);
  }
  quarterlySummaryEdit(data: any) {
    return this.http.post(`${API_URL}/quarterly-edit-manufacturing`, data);
  }
  viewQuarterlySummary(login_access_token: string, unit_id: any, role_id: any, dept_id: any) {
    return this.http.post(`${API_URL}/quarterly-view-manufacturing`, { login_access_token: login_access_token, unit_id: unit_id, role_id: role_id, dept_id: dept_id });
  }
  deleteQtlySummary(login_token: string, quartupdatmanufacturs_id: number) {
    return this.http.post(`${API_URL}/quarterly-delete-manufacturing`, { login_access_token: login_token, quartupdatmanufacturs_id: quartupdatmanufacturs_id });
  }
  viewSingleQtlySummary(login_access_token: string, id: any) {
    return this.http.post(`${API_URL}/quarterly-details-manufacturing`, { login_access_token: login_access_token, quartupdatmanufacturs_id: id });
  }
  addTaskEventChange(data: any) {
    return this.http.post(`${API_URL}/api-add-events-task`, data);
  }
  viewTaskEventChange(login_token: string, company_id: number) {
    return this.http.post(`${API_URL}/api-view-events-task`, { login_access_token: login_token, company_id: company_id });
  }
  removeTaskEventChange(login_token: string, id: number) {
    return this.http.post(`${API_URL}/api-delete-events-task`, { login_access_token: login_token, events_id: id });

  }
  getCurrency(login_token: string, company_id: number) {
    return this.http.post(`${API_URL}/view-currency`, { login_access_token: login_token, company_id: company_id });
  }
  getdepartmentUser(login_token: string, unit_id: any, company_id: number, dept_id: any) {
    return this.http.post(`${API_URL}/api-get-user-list-dept-wise`, { login_access_token: login_token, unit_id: unit_id, company_id: company_id, dept_id: dept_id });

  }
  editTaskEventChange(data: any) {
    return this.http.post(`${API_URL}/api-update-events-task`, data);
  }
  // getCurrency(login_token:string){
  //   return this.http.post(`${API_URL}/view-currency`, login_access_token: login_token});
  // }
}
