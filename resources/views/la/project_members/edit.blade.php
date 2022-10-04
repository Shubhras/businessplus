@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/project_members') }}">Project member</a> :
@endsection
@section("contentheader_description", $project_member->$view_col)
@section("section", "Project members")
@section("section_url", url(config('laraadmin.adminRoute') . '/project_members'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Project members Edit : ".$project_member->$view_col)

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
				{!! Form::model($project_member, ['route' => [config('laraadmin.adminRoute') . '.project_members.update', $project_member->id ], 'method'=>'PUT', 'id' => 'project_member-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'project_id')
					@la_input($module, 'project_leader')
					@la_input($module, 'user_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/project_members') }}">Cancel</a></button>
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
	$("#project_member-edit-form").validate({
		
	});
});
</script>
@endpush
