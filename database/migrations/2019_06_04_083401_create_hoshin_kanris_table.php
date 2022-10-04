<?php
/**
 * Migration genrated using LaraAdmin
 * Help: http://laraadmin.com
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Dwij\Laraadmin\Models\Module;

class CreateHoshinKanrisTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Module::generate("Hoshin_kanris", 'hoshin_kanris', 'action_plan_id', 'fa-cube', [
            ["dept_id", "Department name", "Dropdown", false, "", 0, 0, true, "@department_masters"],
            ["str_obj_id", "Strategic Objective", "Dropdown", false, "", 0, 0, true, "@strategic_objectives"],
            ["initiatives_id", "Initiatives", "Dropdown", false, "", 0, 0, true, "@initiatives"],
            ["action_plan_id", "Action Plan", "Dropdown", false, "", 0, 0, true, "@action_plans"],
            ["kpi_id", "KPI", "Integer", true, "", 0, 11, false],
            ["area_manager", "Area Manager", "Dropdown", false, "", 0, 0, true, "@users"],
            ["area_manager_value", "Area Manager Value", "Integer", false, "", 0, 11, false],
            ["area_manager_percent", "Area Manager %", "Integer", false, "100", 0, 11, false],
            ["dept_head", "Department Head", "Dropdown", false, "", 0, 0, false, "@users"],
            ["dept_head_value", "Dept Head Value", "Integer", false, "", 0, 11, false],
            ["dept_head_percent", "Dept Head Percent", "Integer", false, "", 0, 11, false],
            ["section_head", "Section Head", "Integer", false, "", 0, 11, false],
            ["section_head_value", "Section Head Value", "Integer", false, "", 0, 11, false],
            ["section_head_percent", "Section Head Percent", "Integer", false, "", 0, 11, false],
            ["supervisor_head", "Supervisor Head", "Integer", false, "", 0, 11, false],
            ["superv_head_value", "Super Head Value", "Integer", false, "", 0, 11, false],
            ["superv_head_percent", "Super Head Percent", "Integer", false, "", 0, 11, false],
            ["unit_id", "Unit Name", "Dropdown", false, "0", 0, 0, false, "@units"],
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
        if (Schema::hasTable('hoshin_kanris')) {
            Schema::drop('hoshin_kanris');
        }
    }
}
