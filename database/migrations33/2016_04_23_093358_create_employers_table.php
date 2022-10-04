<?php
/**
 * Migration genrated using LaraAdmin
 * Help: http://laraadmin.com
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Dwij\Laraadmin\Models\Module;

class CreateEmployersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Module::generate("Employers", 'employers', 'name', 'fa-cube', [
            ["multi_section_id", "Select Sections", "Multiselect", false, "", 0, 256, false, "@sections"],
            ["reset_password_token", "reset_password_token", "TextField", false, "", 0, 256, false],
            ["multi_unit_id", "Multi Unit", "Multiselect", false, "", 0, 256, true, "@units"],
            ["multi_dept_id", "Multi Dept", "Multiselect", false, "", 0, 256, true, "@department_masters"],
            ["name", "Name", "TextField", false, "", 0, 50, false],
            ["designation", "Designation", "TextField", false, "", 0, 50, false],
            ["gender", "Gender", "Dropdown", false, "", 0, 0, false, ["Male","Female"]],
            ["mobile", "Mobile", "Mobile", false, "", 0, 10, false],
            ["mobile2", "Mobile2", "Mobile", false, "", 0, 10, false],
            ["email", "Email", "Email", false, "", 0, 100, true],
            ["city", "City", "TextField", false, "", 0, 50, false],
            ["address", "Address", "Textarea", false, "", 0, 256, false],
            ["date_birth", "Date Of Birth", "Date", false, "0", 0, 0, false],
            ["unit_id", "Select Unit", "TextField", false, "", 0, 256, false],
            ["date_hire", "Date Of Hire", "Date", false, "0", 0, 0, false],
            ["dept_master_id", "Select Department ", "TextField", false, "", 0, 100, false],
            ["section_id", "Select Section", "TextField", false, "", 0, 256, false],
            ["role_id", "Select Role", "Dropdown", false, "", 0, 0, false, "@roles"],
            ["pan_card_no", "Pan Card", "TextField", false, "", 0, 10, false],
            ["user_id", "User Name", "Dropdown", false, "", 0, 256, false, "@users"],
        ]);
		
		/*
		Row Format:
		["field_name_db", "Label", "UI Type", "Unique", "Default_Value", "min_length", "max_length", "Required", "Pop_values"]
        Module::generate("Module_Name", "Table_Name", "view_column_name" "Fields_Array");
        
		Module::generate("Books", 'books', 'name', [
            ["address",     "Address",      "Address",  false, "",          0,  1000,   true],
            ["restricted",  "Restricted",   "Checkbox", false, false,       0,  0,      false],
            ["price",       "Price",        "Currency", false, 0.0,         0,  0,      true],
            ["date_release", "Date of Release", "Date", false, "date('Y-m-d')", 0, 0,   false],
            ["time_started", "Start Time",  "Datetime", false, "date('Y-m-d H:i:s')", 0, 0, false],
            ["weight",      "Weight",       "Decimal",  false, 0.0,         0,  20,     true],
            ["publisher",   "Publisher",    "Dropdown", false, "Marvel",    0,  0,      false, ["Bloomsbury","Marvel","Universal"]],
            ["publisher",   "Publisher",    "Dropdown", false, 3,           0,  0,      false, "@publishers"],
            ["email",       "Email",        "Email",    false, "",          0,  0,      false],
            ["file",        "File",         "File",     false, "",          0,  1,      false],
            ["files",       "Files",        "Files",    false, "",          0,  10,     false],
            ["weight",      "Weight",       "Float",    false, 0.0,         0,  20.00,  true],
            ["biography",   "Biography",    "HTML",     false, "<p>This is description</p>", 0, 0, true],
            ["profile_image", "Profile Image", "Image", false, "img_path.jpg", 0, 250,  false],
            ["pages",       "Pages",        "Integer",  false, 0,           0,  5000,   false],
            ["mobile",      "Mobile",       "Mobile",   false, "+91  8888888888", 0, 20,false],
            ["media_type",  "Media Type",   "Multiselect", false, ["Audiobook"], 0, 0,  false, ["Print","Audiobook","E-book"]],
            ["media_type",  "Media Type",   "Multiselect", false, [2,3],    0,  0,      false, "@media_types"],
            ["name",        "Name",         "Name",     false, "John Doe",  5,  250,    true],
            ["password",    "Password",     "Password", false, "",          6,  250,    true],
            ["status",      "Status",       "Radio",    false, "Published", 0,  0,      false, ["Draft","Published","Unpublished"]],
            ["author",      "Author",       "String",   false, "JRR Tolkien", 0, 250,   true],
            ["genre",       "Genre",        "Taginput", false, ["Fantacy","Adventure"], 0, 0, false],
            ["description", "Description",  "Textarea", false, "",          0,  1000,   false],
            ["short_intro", "Introduction", "TextField",false, "",          5,  250,    true],
            ["website",     "Website",      "URL",      false, "http://dwij.in", 0, 0,  false],
        ]);
		*/
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('employers')) {
            Schema::drop('employers');
        }
    }
}
