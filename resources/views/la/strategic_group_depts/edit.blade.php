@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/strategic_group_depts') }}">Strategic Group Dept</a> :
@endsection
@section("contentheader_description", $strategic_group_dept->$view_col)
@section("section", "Strategic Group Depts")
@section("section_url", url(config('laraadmin.adminRoute') . '/strategic_group_depts'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Strategic Group Depts Edit : ".$strategic_group_dept->$view_col)

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
				{!! Form::model($strategic_group_dept, ['route' => [config('laraadmin.adminRoute') . '.strategic_group_depts.update', $strategic_group_dept->id ], 'method'=>'PUT', 'id' => 'strategic_group_dept-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'so_id')
					@la_input($module, 'dept_id')
					@la_input($module, 'unit_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/strategic_group_depts') }}">Cancel</a></button>
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
	$("#strategic_group_dept-edit-form").validate({
		
	});
});
</script>
@endpush
