@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/project_issue_remarks') }}">Project issue remark</a> :
@endsection
@section("contentheader_description", $project_issue_remark->$view_col)
@section("section", "Project issue remarks")
@section("section_url", url(config('laraadmin.adminRoute') . '/project_issue_remarks'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Project issue remarks Edit : ".$project_issue_remark->$view_col)

@section("main-content")

@if (count($errors) > 0)
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="box">
	<div class="box-header">
		
	</div>
	<div class="box-body">
		<div class="row">
			<div class="col-md-8 col-md-offset-2">
				{!! Form::model($project_issue_remark, ['route' => [config('laraadmin.adminRoute') . '.project_issue_remarks.update', $project_issue_remark->id ], 'method'=>'PUT', 'id' => 'project_issue_remark-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'remark')
					@la_input($module, 'issue_id')
					@la_input($module, 'image_id')
					@la_input($module, 'status_id')
					@la_input($module, 'user_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/project_issue_remarks') }}">Cancel</a></button>
					</div>
				{!! Form::close() !!}
			</div>
		</div>
	</div>
</div>

@endsection

@push('scripts')
<script>
$(function () {
	$("#project_issue_remark-edit-form").validate({
		
	});
});
</script>
@endpush
