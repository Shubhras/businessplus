@include('header')


    <body class="fixed-left">

        <!-- Begin page -->
        <div id="wrapper">

            <!-- Top Bar Start -->
            <div class="topbar">

                <!-- LOGO -->
                <div class="topbar-left">
                    <div class="text-center">
                        <a href="index.html" class="logo"><i class="mdi mdi-radar"></i> <span>Minton</span></a>
                    </div>
                </div>

                <!-- Button mobile view to collapse sidebar menu -->
                <nav class="navbar-custom">

                    <ul class="list-inline float-right mb-0">

                        <li class="list-inline-item notification-list hide-phone">
                            <a class="nav-link waves-light waves-effect" href="#" id="btn-fullscreen">
                                <i class="mdi mdi-crop-free noti-icon"></i>
                            </a>
                        </li>

                        <li class="list-inline-item notification-list">
                            <a class="nav-link right-bar-toggle waves-light waves-effect" href="#">
                                <i class="mdi mdi-dots-horizontal noti-icon"></i>
                            </a>
                        </li>

                        <li class="list-inline-item dropdown notification-list">
                            <a class="nav-link dropdown-toggle arrow-none waves-light waves-effect" data-toggle="dropdown" href="#" role="button"
                               aria-haspopup="false" aria-expanded="false">
                                <i class="mdi mdi-bell noti-icon"></i>
                                <span class="badge badge-pink noti-icon-badge">4</span>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right dropdown-arrow dropdown-menu-lg" aria-labelledby="Preview">
                                <!-- item-->
                                <div class="dropdown-item noti-title">
                                    <h5 class="font-16"><span class="badge badge-danger float-right">5</span>Notification</h5>
                                </div>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item notify-item">
                                    <div class="notify-icon bg-success"><i class="mdi mdi-comment-account"></i></div>
                                    <p class="notify-details">Robert S. Taylor commented on Admin<small class="text-muted">1 min ago</small></p>
                                </a>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item notify-item">
                                    <div class="notify-icon bg-info"><i class="mdi mdi-account"></i></div>
                                    <p class="notify-details">New user registered.<small class="text-muted">1 min ago</small></p>
                                </a>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item notify-item">
                                    <div class="notify-icon bg-danger"><i class="mdi mdi-airplane"></i></div>
                                    <p class="notify-details">Carlos Crouch liked <b>Admin</b><small class="text-muted">1 min ago</small></p>
                                </a>

                                <!-- All-->
                                <a href="javascript:void(0);" class="dropdown-item notify-item notify-all">
                                    View All
                                </a>

                            </div>
                        </li>

                        <li class="list-inline-item dropdown notification-list">
                            <a class="nav-link dropdown-toggle waves-effect waves-light nav-user" data-toggle="dropdown" href="#" role="button"
                               aria-haspopup="false" aria-expanded="false">
                                <img src="{{url('/Minton/assets/images/users/avatar-1.jpg')}}" alt="user" class="rounded-circle">
                            </a>
                            <div class="dropdown-menu dropdown-menu-right profile-dropdown " aria-labelledby="Preview">
                                <!-- item-->
                                <div class="dropdown-item noti-title">
                                    <h5 class="text-overflow"><small>Welcome ! John</small> </h5>
                                </div>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item notify-item">
                                    <i class="mdi mdi-account"></i> <span>Profile</span>
                                </a>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item notify-item">
                                    <i class="mdi mdi-settings"></i> <span>Settings</span>
                                </a>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item notify-item">
                                    <i class="mdi mdi-lock-open"></i> <span>Lock Screen</span>
                                </a>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item notify-item">
                                    <i class="mdi mdi-logout"></i> <span>Logout</span>
                                </a>

                            </div>
                        </li>

                    </ul>

                    <ul class="list-inline menu-left mb-0">
                        <li class="float-left">
                            <button class="button-menu-mobile open-left waves-light waves-effect">
                                <i class="mdi mdi-menu"></i>
                            </button>
                        </li>
                        <li class="hide-phone app-search">
                            <form role="search" class="">
                                <input type="text" placeholder="Search..." class="form-control">
                                <a href=""><i class="fa fa-search"></i></a>
                            </form>
                        </li>
                    </ul>

                </nav>

            </div>
            <!-- Top Bar End -->


            <!-- ========== Left Sidebar Start ========== -->

           @include('sidebar_navigation')
            <!-- Left Sidebar End -->




            <!-- ============================================================== -->
            <!-- Start right Content here -->
            <!-- ============================================================== -->
            <div class="content-page">
                <!-- Start content -->
                <div class="content">
                    <div class="container-fluid">

                        <!-- Page-Title -->
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="page-title-box">
                                    <h4 class="page-title">Task</h4>
                                    <ol class="breadcrumb float-right">
                                        <li class="breadcrumb-item"><a href="#">Minton</a></li>
                                        <li class="breadcrumb-item"><a href="#">Apps</a></li>
                                        <li class="breadcrumb-item active">Tickets</li>
                                    </ol>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="card-box">

                                    <div class="text-center mb-4">
                                        <div class="row">
                                            <div class="col-xs-6 col-sm-3">
                                                <div class="card-box bg-secondary text-white">
                                                    <i class="fi-tag"></i>
                                                    <h3 class="m-b-10">25563</h3>
                                                    <p class="text-uppercase m-b-5 font-13 font-weight-medium">Total tickets</p>
                                                </div>
                                            </div>
                                            <div class="col-xs-6 col-sm-3">
                                                <div class="card-box bg-primary text-white">
                                                    <i class="fi-archive"></i>
                                                    <h3 class="m-b-10">6952</h3>
                                                    <p class="text-uppercase m-b-5 font-13 font-weight-medium">Pending Tickets</p>
                                                </div>
                                            </div>
                                            <div class="col-xs-6 col-sm-3">
                                                <div class="card-box bg-success text-white">
                                                    <i class="fi-help"></i>
                                                    <h3 class="m-b-10">18361</h3>
                                                    <p class="text-uppercase m-b-5 font-13 font-weight-medium">Closed Tickets</p>
                                                </div>
                                            </div>
                                            <div class="col-xs-6 col-sm-3">
                                                <div class="card-box bg-danger text-white">
                                                    <i class="fi-delete"></i>
                                                    <h3 class="m-b-10">250</h3>
                                                    <p class="text-uppercase m-b-5 font-13 font-weight-medium">
                                                    DELAYED Task</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                        <!-- add button -->

            
                  <!-- Modal -->
                        <div class="modal fade" id="myModal" role="dialog">
                        <div class="modal-dialog">
    
              <!-- Modal content-->
                <div class="modal-content">
                 <div class="modal-header">
               <hAdd categeries4 class="modal-title">Tickets</h4>
                </div>
                       <div class="modal-body">
                         <label>Id</label>
                           <input type="text" name="" style="width: 300px; margin-left: 90px;">
                        </div>
                       
                       <div class="modal-body">
                         <label>Requested By</label>
                           <input type="text" name="" style="width: 297px; margin-left: 10px;">
                        </div>
                        <div class="modal-body">
                         <label>Subject</label>
                           <input type="text" name="" style="width: 297px; margin-left: 52px;">
                        </div>
                       
                        <div class="modal-body">
                           <label>Assignee</label>
                           <input type="text" name="" style="width: 300px; margin-left: 40px;">
                        </div>
                         <div class="modal-body">
                           <label>Priority</label>
                           <input type="text" name="" style="width: 300px; margin-left: 47px;">
                        </div>
                         <div class="modal-body">
                           <label>Status</label>
                           <input type="text" name="" style="width: 300px; margin-left: 55px;">
                        </div>
                         <div class="modal-body">
                           <label>Created Date</label>
                           <input type="text" name="" style="width: 300px; margin-left: 5px;">
                        </div>
                         <div class="modal-body">
                        <label>Due Date</label>
                           <input type="text" name="" style="width: 300px; margin-left: 27px;"> 
                        </div>
                         <div class="modal-body">
                        <label>Action</label>
                           <input type="text" name="" style="width: 300px; margin-left: 45px;"> 
                        </div>
                    <div class="modal-footer">
                          <button type="button" class="btn btn-success" data-dismiss="modal">Submit</button>
                           <button type="button" class="btn btn-default" data-dismiss="modal">Cancle</button>
                           </div>
                              </div>
                                  </div>
                              </div>

                    <button onclick="myFunction()" class="btn btn-primary waves-effect waves-light">Filter</button>
                 <div id="myDIV">
             <!--   <div class="btn-group"> -->
                    <select>
                     <option > Priority</option>
                <option value="red" class="badge badge-danger red box">High</option>
                <option value="green" class="badge badge-warning green box" id="Mediumm">Medium</option>
                 <option value="blue" class="badge badge-secondary blue box">Low</option> 
                     </select>
                         <select>
                          <option>Status</option>
                           <option value="Open" class="badge badge-success Open box1">Open</option>
                           <option value="Closed" class="badge badge-secondary Closed box1">Closed</option>
                       </select>
             <select>
             <option >Assigne</option>
            <option value="first" class="text-primary first box2">Smith</option>
            <option value="second" class="text-danger second box2">Cook</option>
             <option value="third" class="text-success third box2">Davide</option>
             <option value="forth" class="text-warning forth box2">Finch</option>
              </select>
          
            <input type="text" name="datefilter" value="" />

                 </div> 
             </div>
   <!--        
<script type="text/javascript">
function myFunction() {
    var x = document.getElementById("myDate").value;
    document.getElementById("demo").innerHTML = x;
} 
</script> -->

<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<script type="text/javascript">
$(document).ready(function(){
    $("select").change(function(){
        $(this).find("option:selected").each(function(){
            var optionValue = $(this).attr("value");
            if(optionValue){
                $(".box2").not("." + optionValue).hide();
                $("." + optionValue).hide();
            } else{
                $(".box2").show();
            }
        });
    }).change();
});
</script>

 <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<script type="text/javascript">
$(document).ready(function(){
    $("select").change(function(){
        $(this).find("option:selected").each(function(){
            var optionValue = $(this).attr("value");
            if(optionValue){
                $(".box1").not("." + optionValue).hide();
                $("." + optionValue).hide();
            } else{
                $(".box1").show();
            }
        });
    }).change();
});
</script>
<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<script type="text/javascript">
$(document).ready(function(){
    $("select").change(function(){
        $(this).find("option:selected").each(function(){
            var optionValue = $(this).attr("value");
            if(optionValue){
                $(".box").not("." + optionValue).hide();
                $("." + optionValue).show();
            } else{
                $(".box").show();
            }
        });
    }).change();
});
</script>

    


                                <div class="popup_btn">
                    <button type="button" class="btn btn-info btn-lg btn-intext" data-toggle="modal" data-target="#myModal">Add Task</button>
             </div>

                        <!-- table -->
                                    <table class="table table-hover m-0 table-centered dt-responsive nowrap" cellspacing="0" width="100%" id="datatable">
                                        <thead class="bg-light">
                                        <tr>
                                            <th class="font-weight-medium">ID</th>
                                     <th class="font-weight-medium">Requested By</th>
                                     <th class="font-weight-medium">Subject</th>
                                      <th class="font-weight-medium">Assignee</th>
                                     <th class="font-weight-medium">Priority</th>
                                     <th class="font-weight-medium">Status</th>
                                     <th class="font-weight-medium">Created Date</th>
                                     <th class="font-weight-medium">Due Date</th>
                                     <th class="font-weight-medium">Action</th>
                                     </tr>
                                     </thead>

                                        <tbody class="font-14">
                                            <tr>
                                                <td><b>#1256</b></td>
                                                <td>
                                                    <a href="javascript: void(0);" class="text-dark">
                                                        <img src="{{url('/mailton/assets/images/users/avatar-2.jpg')}}" title="contact-img" class="thumb-sm rounded-circle" />
                                                        <span class="ml-2">George A. Lianes</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    Support for theme
                                                </td>

                                                <td>
                                                    <a href="javascript: void(0);">
                                                        <img src="{{url('/mailton/assets/images/users/avatar-10.jpg')}}" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="badge badge-secondary">Low</span>
                                                </td>

                                                <td>
                                                    <span class="badge badge-success">Open</span>
                                                </td>

                                                <td>
                                                    2017/04/28
                                                </td>

                                                <td>
                                                    2017/04/28
                                                </td>

                                                <td>
                                                    <div class="btn-group dropdown">
                                                        <a href="javascript: void(0);" class="dropdown-toggle arrow-none btn btn-light btn-sm" data-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></a>
                                                        <div class="dropdown-menu dropdown-menu-right">
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-pencil mr-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-check-all mr-2 text-muted font-18 vertical-middle"></i>Close</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-delete mr-2 text-muted font-18 vertical-middle"></i>Remove</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td><b>#2542</b></td>
                                                <td>
                                                    <a href="javascript: void(0);" class="text-dark">
                                                        <img src="{{url('/mailton/assets/images/users/avatar-3.jpg')}}" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                        <span class="ml-2">Jose D. Delacruz</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    New submission on your website
                                                </td>

                                                <td>
                                                    <a href="javascript: void(0);">
                                                        <img src="assets/images/users/avatar-9.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="badge badge-warning">Medium</span>
                                                </td>

                                                <td>
                                                    <span class="badge badge-secondary">Closed</span>
                                                </td>

                                                <td>
                                                    2008/04/25
                                                </td>

                                                <td>
                                                    2008/04/25
                                                </td>

                                                <td>
                                                    <div class="btn-group dropdown">
                                                        <a href="javascript: void(0);" class="dropdown-toggle arrow-none btn btn-light btn-sm" data-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></a>
                                                        <div class="dropdown-menu dropdown-menu-right">
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-pencil mr-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-check-all mr-2 text-muted font-18 vertical-middle"></i>Close</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-delete mr-2 text-muted font-18 vertical-middle"></i>Remove</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td><b>#320</b></td>
                                                <td>
                                                    <a href="javascript: void(0);" class="text-dark">
                                                        <img src="assets/images/users/avatar-5.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                        <span class="ml-2">Phyllis K. Maciel</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    Verify your new email address!
                                                </td>

                                                <td>
                                                    <a href="javascript: void(0);">
                                                        <img src="assets/images/users/avatar-10.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="badge badge-danger">High</span>
                                                </td>

                                                <td>
                                                    <span class="badge badge-success">Open</span>
                                                </td>

                                                <td>
                                                    2017/04/20
                                                </td>

                                                <td>
                                                    2017/04/25
                                                </td>

                                                <td>
                                                    <div class="btn-group dropdown">
                                                        <a href="javascript: void(0);" class="dropdown-toggle arrow-none btn btn-light btn-sm" data-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></a>
                                                        <div class="dropdown-menu dropdown-menu-right">
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-pencil mr-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-check-all mr-2 text-muted font-18 vertical-middle"></i>Close</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-delete mr-2 text-muted font-18 vertical-middle"></i>Remove</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td><b>#1254</b></td>
                                                <td>
                                                    <a href="javascript: void(0);" class="text-dark">
                                                        <img src="assets/images/users/avatar-8.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                        <span class="ml-2">Margeret V. Ligon</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    Your application has been received!
                                                </td>

                                                <td>
                                                    <a href="javascript: void(0);">
                                                        <img src="assets/images/users/avatar-10.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="badge badge-danger">High</span>
                                                </td>

                                                <td>
                                                    <span class="badge badge-secondary">Closed</span>
                                                </td>

                                                <td>
                                                    01/04/2017
                                                </td>

                                                <td>
                                                    21/05/2017
                                                </td>

                                                <td>
                                                    <div class="btn-group dropdown">
                                                        <a href="javascript: void(0);" class="dropdown-toggle arrow-none btn btn-light btn-sm" data-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></a>
                                                        <div class="dropdown-menu dropdown-menu-right">
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-pencil mr-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-check-all mr-2 text-muted font-18 vertical-middle"></i>Close</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-delete mr-2 text-muted font-18 vertical-middle"></i>Remove</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td><b>#1020</b></td>
                                                <td>
                                                    <a href="javascript: void(0);" class="text-dark">
                                                        <img src="assets/images/users/avatar-9.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                        <span class="ml-2">Erwin E. Brown</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    A new rating has been received
                                                </td>

                                                <td>
                                                    <a href="javascript: void(0);">
                                                        <img src="assets/images/users/avatar-1.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="badge badge-warning">Medium</span>
                                                </td>

                                                <td>
                                                    <span class="badge badge-secondary">Closed</span>
                                                </td>

                                                <td>
                                                    2013/08/11
                                                </td>

                                                <td>
                                                    2013/08/30
                                                </td>

                                                <td>
                                                    <div class="btn-group dropdown">
                                                        <a href="javascript: void(0);" class="dropdown-toggle arrow-none btn btn-light btn-sm" data-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></a>
                                                        <div class="dropdown-menu dropdown-menu-right">
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-pencil mr-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-check-all mr-2 text-muted font-18 vertical-middle"></i>Close</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-delete mr-2 text-muted font-18 vertical-middle"></i>Remove</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td><b>#854</b></td>
                                                <td>
                                                    <a href="javascript: void(0);" class="text-dark">
                                                        <img src="assets/images/users/avatar-2.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                        <span class="ml-2">William L. Trent</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    Your Profile has been accepted
                                                </td>

                                                <td>
                                                    <a href="javascript: void(0);">
                                                        <img src="assets/images/users/avatar-10.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="badge badge-danger">High</span>
                                                </td>

                                                <td>
                                                    <span class="badge badge-success">Open</span>
                                                </td>

                                                <td>
                                                    01/04/2017
                                                </td>

                                                <td>
                                                    21/05/2017
                                                </td>

                                                <td>
                                                    <div class="btn-group dropdown">
                                                        <a href="javascript: void(0);" class="dropdown-toggle arrow-none btn btn-light btn-sm" data-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></a>
                                                        <div class="dropdown-menu dropdown-menu-right">
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-pencil mr-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-check-all mr-2 text-muted font-18 vertical-middle"></i>Close</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-delete mr-2 text-muted font-18 vertical-middle"></i>Remove</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td><b>#9501</b></td>
                                                <td>
                                                    <a href="javascript: void(0);" class="text-dark">
                                                        <img src="assets/images/users/avatar-10.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                        <span class="ml-2">Amy R. Barnaby</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    Homeworth for your property increased
                                                </td>

                                                <td>
                                                    <a href="javascript: void(0);">
                                                        <img src="assets/images/users/avatar-3.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="badge badge-secondary">Low</span>
                                                </td>

                                                <td>
                                                    <span class="badge badge-success">Open</span>
                                                </td>

                                                <td>
                                                    01/04/2017
                                                </td>

                                                <td>
                                                    21/05/2017
                                                </td>

                                                <td>
                                                    <div class="btn-group dropdown">
                                                        <a href="javascript: void(0);" class="dropdown-toggle arrow-none btn btn-light btn-sm" data-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></a>
                                                        <div class="dropdown-menu dropdown-menu-right">
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-pencil mr-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-check-all mr-2 text-muted font-18 vertical-middle"></i>Close</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-delete mr-2 text-muted font-18 vertical-middle"></i>Remove</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td><b>#3652</b></td>
                                                <td>
                                                    <a href="javascript: void(0);" class="text-dark">
                                                        <img src="assets/images/users/avatar-3.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                        <span class="ml-2">Jessica T. Phillips</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    Item Support Message sent
                                                </td>

                                                <td>
                                                    <a href="javascript: void(0);">
                                                        <img src="assets/images/users/avatar-9.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="badge badge-warning">Medium</span>
                                                </td>

                                                <td>
                                                    <span class="badge badge-secondary">Closed</span>
                                                </td>

                                                <td>
                                                    01/04/2017
                                                </td>

                                                <td>
                                                    21/05/2017
                                                </td>

                                                <td>
                                                    <div class="btn-group dropdown">
                                                        <a href="javascript: void(0);" class="dropdown-toggle arrow-none btn btn-light btn-sm" data-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></a>
                                                        <div class="dropdown-menu dropdown-menu-right">
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-pencil mr-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-check-all mr-2 text-muted font-18 vertical-middle"></i>Close</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-delete mr-2 text-muted font-18 vertical-middle"></i>Remove</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td><b>#9852</b></td>
                                                <td>
                                                    <a href="javascript: void(0);" class="text-dark">
                                                        <img src="assets/images/users/avatar-5.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                        <span class="ml-2">Debra J. Wilson</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    Your item has been updated!
                                                </td>

                                                <td>
                                                    <a href="javascript: void(0);">
                                                        <img src="assets/images/users/avatar-10.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="badge badge-danger">High</span>
                                                </td>

                                                <td>
                                                    <span class="badge badge-success">Open</span>
                                                </td>

                                                <td>
                                                    01/04/2017
                                                </td>

                                                <td>
                                                    21/05/2017
                                                </td>

                                                <td>
                                                    <div class="btn-group dropdown">
                                                        <a href="javascript: void(0);" class="dropdown-toggle arrow-none btn btn-light btn-sm" data-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></a>
                                                        <div class="dropdown-menu dropdown-menu-right">
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-pencil mr-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-check-all mr-2 text-muted font-18 vertical-middle"></i>Close</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-delete mr-2 text-muted font-18 vertical-middle"></i>Remove</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td><b>#3652</b></td>
                                                <td>
                                                    <a href="javascript: void(0);" class="text-dark">
                                                        <img src="assets/images/users/avatar-4.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                        <span class="ml-2">Luke J. Sain</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    Your password has been reset
                                                </td>

                                                <td>
                                                    <a href="javascript: void(0);">
                                                        <img src="assets/images/users/avatar-10.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="badge badge-secondary">Low</span>
                                                </td>

                                                <td>
                                                    <span class="badge badge-success">Open</span>
                                                </td>

                                                <td>
                                                    01/04/2017
                                                </td>

                                                <td>
                                                    21/05/2017
                                                </td>

                                                <td>
                                                    <div class="btn-group dropdown">
                                                        <a href="javascript: void(0);" class="dropdown-toggle arrow-none btn btn-light btn-sm" data-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></a>
                                                        <div class="dropdown-menu dropdown-menu-right">
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-pencil mr-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-check-all mr-2 text-muted font-18 vertical-middle"></i>Close</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-delete mr-2 text-muted font-18 vertical-middle"></i>Remove</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td><b>#1352</b></td>
                                                <td>
                                                    <a href="javascript: void(0);" class="text-dark">
                                                        <img src="assets/images/users/avatar-5.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                        <span class="ml-2">Karen R. Doyle</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    Question regarding your Bootstrap Theme
                                                </td>

                                                <td>
                                                    <a href="javascript: void(0);">
                                                        <img src="assets/images/users/avatar-8.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="badge badge-danger">High</span>
                                                </td>

                                                <td>
                                                    <span class="badge badge-success">Open</span>
                                                </td>

                                                <td>
                                                    01/04/2017
                                                </td>

                                                <td>
                                                    21/05/2017
                                                </td>

                                                <td>
                                                    <div class="btn-group dropdown">
                                                        <a href="javascript: void(0);" class="dropdown-toggle arrow-none btn btn-light btn-sm" data-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></a>
                                                        <div class="dropdown-menu dropdown-menu-right">
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-pencil mr-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-check-all mr-2 text-muted font-18 vertical-middle"></i>Close</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-delete mr-2 text-muted font-18 vertical-middle"></i>Remove</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td><b>#3562</b></td>
                                                <td>
                                                    <a href="javascript: void(0);" class="text-dark">
                                                        <img src="assets/images/users/avatar-8.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                        <span class="ml-2">Freddie J. Plourde</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    Security alert for my account
                                                </td>

                                                <td>
                                                    <a href="javascript: void(0);">
                                                        <img src="assets/images/users/avatar-2.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="badge badge-secondary">Low</span>
                                                </td>

                                                <td>
                                                    <span class="badge badge-success">Open</span>
                                                </td>

                                                <td>
                                                    01/04/2017
                                                </td>

                                                <td>
                                                    21/05/2017
                                                </td>

                                                <td>
                                                    <div class="btn-group dropdown">
                                                        <a href="javascript: void(0);" class="dropdown-toggle arrow-none btn btn-light btn-sm" data-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></a>
                                                        <div class="dropdown-menu dropdown-menu-right">
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-pencil mr-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-check-all mr-2 text-muted font-18 vertical-middle"></i>Close</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-delete mr-2 text-muted font-18 vertical-middle"></i>Remove</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td><b>#3658</b></td>
                                                <td>
                                                    <a href="javascript: void(0);" class="text-dark">
                                                        <img src="assets/images/users/avatar-9.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                        <span class="ml-2">Darrell J. Cook</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    Christopher S. Ahmad
                                                </td>

                                                <td>
                                                    <a href="javascript: void(0);">
                                                        <img src="assets/images/users/avatar-10.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="badge badge-warning">Medium</span>
                                                </td>

                                                <td>
                                                    <span class="badge badge-secondary">Closed</span>
                                                </td>

                                                <td>
                                                    01/04/2017
                                                </td>

                                                <td>
                                                    21/05/2017
                                                </td>

                                                <td>
                                                    <div class="btn-group dropdown">
                                                        <a href="javascript: void(0);" class="dropdown-toggle arrow-none btn btn-light btn-sm" data-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></a>
                                                        <div class="dropdown-menu dropdown-menu-right">
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-pencil mr-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-check-all mr-2 text-muted font-18 vertical-middle"></i>Close</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-delete mr-2 text-muted font-18 vertical-middle"></i>Remove</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td><b>#2251</b></td>
                                                <td>
                                                    <a href="javascript: void(0);" class="text-dark">
                                                        <img src="assets/images/users/avatar-8.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                        <span class="ml-2">Mark C. Diaz</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    Verify your new email address!
                                                </td>

                                                <td>
                                                    <a href="javascript: void(0);">
                                                        <img src="assets/images/users/avatar-10.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="badge badge-danger">High</span>
                                                </td>

                                                <td>
                                                    <span class="badge badge-success">Open</span>
                                                </td>

                                                <td>
                                                    01/04/2017
                                                </td>

                                                <td>
                                                    21/05/2017
                                                </td>

                                                <td>
                                                    <div class="btn-group dropdown">
                                                        <a href="javascript: void(0);" class="dropdown-toggle arrow-none btn btn-light btn-sm" data-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></a>
                                                        <div class="dropdown-menu dropdown-menu-right">
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-pencil mr-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-check-all mr-2 text-muted font-18 vertical-middle"></i>Close</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-delete mr-2 text-muted font-18 vertical-middle"></i>Remove</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td><b>#3654</b></td>
                                                <td>
                                                    <a href="javascript: void(0);" class="text-dark">
                                                        <img src="assets/images/users/avatar-2.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                        <span class="ml-2">Robert K. Joseph</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    Support for theme
                                                </td>

                                                <td>
                                                    <a href="javascript: void(0);">
                                                        <img src="assets/images/users/avatar-10.jpg" alt="contact-img" title="contact-img" class="thumb-sm rounded-circle" />
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="badge badge-secondary">Low</span>
                                                </td>

                                                <td>
                                                    <span class="badge badge-success">Open</span>
                                                </td>

                                                <td>
                                                    01/04/2017
                                                </td>

                                                <td>
                                                    21/05/2017
                                                </td>

                                                <td>
                                                    <div class="btn-group dropdown">
                                                        <a href="javascript: void(0);" class="dropdown-toggle arrow-none btn btn-light btn-sm" data-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></a>
                                                        <div class="dropdown-menu dropdown-menu-right">
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-pencil mr-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-check-all mr-2 text-muted font-18 vertical-middle"></i>Close</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-delete mr-2 text-muted font-18 vertical-middle"></i>Remove</a>
                                                            <a class="dropdown-item" href="#"><i class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div><!-- end col -->
                        </div>
                        <!-- end row -->

                    </div>
                    <!-- end container -->
                </div>
                <!-- end content -->

                <footer class="footer">
                    2016 - 2018 © Minton - Coderthemes.com
                </footer>

            </div>
            <!-- ============================================================== -->
            <!-- End Right content here -->
            <!-- ============================================================== -->


            <!-- Right Sidebar -->
            <div class="side-bar right-bar">
                <div class="">
                    <ul class="nav nav-tabs tabs-bordered nav-justified">
                        <li class="nav-item">
                            <a href="#home-2" class="nav-link active" data-toggle="tab" aria-expanded="false">
                                Activity
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#messages-2" class="nav-link" data-toggle="tab" aria-expanded="true">
                                Settings
                            </a>
                        </li>
                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="home-2">
                            <div class="timeline-2">
                                <div class="time-item">
                                    <div class="item-info">
                                        <small class="text-muted">5 minutes ago</small>
                                        <p><strong><a href="#" class="text-info">John Doe</a></strong> Uploaded a photo <strong>"DSC000586.jpg"</strong></p>
                                    </div>
                                </div>

                                <div class="time-item">
                                    <div class="item-info">
                                        <small class="text-muted">30 minutes ago</small>
                                        <p><a href="" class="text-info">Lorem</a> commented your post.</p>
                                        <p><em>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam laoreet tellus ut tincidunt euismod. "</em></p>
                                    </div>
                                </div>

                                <div class="time-item">
                                    <div class="item-info">
                                        <small class="text-muted">59 minutes ago</small>
                                        <p><a href="" class="text-info">Jessi</a> attended a meeting with<a href="#" class="text-success">John Doe</a>.</p>
                                        <p><em>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam laoreet tellus ut tincidunt euismod. "</em></p>
                                    </div>
                                </div>

                                <div class="time-item">
                                    <div class="item-info">
                                        <small class="text-muted">1 hour ago</small>
                                        <p><strong><a href="#" class="text-info">John Doe</a></strong>Uploaded 2 new photos</p>
                                    </div>
                                </div>

                                <div class="time-item">
                                    <div class="item-info">
                                        <small class="text-muted">3 hours ago</small>
                                        <p><a href="" class="text-info">Lorem</a> commented your post.</p>
                                        <p><em>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam laoreet tellus ut tincidunt euismod. "</em></p>
                                    </div>
                                </div>

                                <div class="time-item">
                                    <div class="item-info">
                                        <small class="text-muted">5 hours ago</small>
                                        <p><a href="" class="text-info">Jessi</a> attended a meeting with<a href="#" class="text-success">John Doe</a>.</p>
                                        <p><em>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam laoreet tellus ut tincidunt euismod. "</em></p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div class="tab-pane" id="messages-2">

                            <div class="row m-t-20">
                                <div class="col-8">
                                    <h5 class="m-0 font-15">Notifications</h5>
                                    <p class="text-muted m-b-0"><small>Do you need them?</small></p>
                                </div>
                                <div class="col-4 text-right">
                                    <input type="checkbox" checked data-plugin="switchery" data-color="#3bafda" data-size="small"/>
                                </div>
                            </div>

                            <div class="row m-t-20">
                                <div class="col-8">
                                    <h5 class="m-0 font-15">API Access</h5>
                                    <p class="m-b-0 text-muted"><small>Enable/Disable access</small></p>
                                </div>
                                <div class="col-4 text-right">
                                    <input type="checkbox" checked data-plugin="switchery" data-color="#3bafda" data-size="small"/>
                                </div>
                            </div>

                            <div class="row m-t-20">
                                <div class="col-8">
                                    <h5 class="m-0 font-15">Auto Updates</h5>
                                    <p class="m-b-0 text-muted"><small>Keep up to date</small></p>
                                </div>
                                <div class="col-4 text-right">
                                    <input type="checkbox" checked data-plugin="switchery" data-color="#3bafda" data-size="small"/>
                                </div>
                            </div>

                            <div class="row m-t-20">
                                <div class="col-8">
                                    <h5 class="m-0 font-15">Online Status</h5>
                                    <p class="m-b-0 text-muted"><small>Show your status to all</small></p>
                                </div>
                                <div class="col-4 text-right">
                                    <input type="checkbox" checked data-plugin="switchery" data-color="#3bafda" data-size="small"/>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <!-- /Right-bar -->

        </div>
        <!-- END wrapper -->



        <script>
            var resizefunc = [];
        </script>

        <!-- Plugins  -->
        <script src="{{url('/mailton/assets/js/jquery.min.js')}}"></script>
        <script src="{{url('/mailton/assets/js/popper.min.js')}}"></script><!-- Popper for Bootstrap -->
        <script src="{{url('/mailton/assets/js/bootstrap.min.js')}}"></script>
        <script src="{{url('/mailton/assets/js/detect.js')}}"></script>
        <script src="{{url('/mailton/assets/js/fastclick.js')}}"></script>
        <script src="{{url('/mailton/assets/js/jquery.slimscroll.js')}}"></script>
        <script src="{{url('/mailton/assets/js/jquery.blockUI.js')}}"></script>
        <script src="{{url('/mailton/assets/js/waves.js')}}"></script>
        <script src="{{url('/mailton/assets/js/wow.min.js')}}"></script>
        <script src="{{url('/mailton/assets/js/jquery.nicescroll.js')}}"></script>
        <script src="{{url('/mailton/assets/js/jquery.scrollTo.min.js')}}"></script>
        <script src="{{url('/mailton/plugins/switchery/switchery.min.js')}}"></script>

        <script src="{{url('/mailton/plugins/datatables/jquery.dataTables.min.js')}}"></script>
        <script src="{{url('/mailton/plugins/datatables/dataTables.bootstrap4.min.js')}}"></script>
        <script src="{{url('/mailton/plugins/datatables/dataTables.responsive.min.js')}}"></script>

        <!-- App js -->
        <script src="{{url('/mailton/assets/js/jquery.core.js')}}"></script>
        <script src="{{url('/mailton/assets/js/jquery.app.js')}}"></script>


        <script type="text/javascript">
            $(document).ready(function () {
                $('#datatable').dataTable();
            });

        </script> 

    <script>
function myFunction() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
</script> 

    </body>
</html>