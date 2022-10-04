@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/department_masters') }}">Department master</a> :
@endsection
@section("contentheader_description", $department_master->$view_col)
@section("section", "Department masters")
@section("section_url", url(config('laraadmin.adminRoute') . '/department_masters'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Department masters Edit : ".$department_master->$view_col)

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
				{!! Form::model($department_master, ['route' => [config('laraadmin.adminRoute') . '.department_masters.update', $department_master->id ], 'method'=>'PUT', 'id' => 'department_master-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'dept_name')
					@la_input($module, 'user_id')
					@la_input($module, 'unit_id')
					@la_input($module, 'enable')
					@la_input($module, 'company_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/department_masters') }}">Cancel</a></button>
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
	$("#department_master-edit-form").validate({
		
	});
});
</script>
@endpush
