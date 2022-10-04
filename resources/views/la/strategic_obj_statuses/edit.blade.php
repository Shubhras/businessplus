@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/strategic_obj_statuses') }}">Strategic obj status</a> :
@endsection
@section("contentheader_description", $strategic_obj_status->$view_col)
@section("section", "Strategic obj statuses")
@section("section_url", url(config('laraadmin.adminRoute') . '/strategic_obj_statuses'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Strategic obj statuses Edit : ".$strategic_obj_status->$view_col)

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
				{!! Form::model($strategic_obj_status, ['route' => [config('laraadmin.adminRoute') . '.strategic_obj_statuses.update', $strategic_obj_status->id ], 'method'=>'PUT', 'id' => 'strategic_obj_status-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 's_o_id')
					@la_input($module, 'status_id')
					@la_input($module, 'percentage')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/strategic_obj_statuses') }}">Cancel</a></button>
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
	$("#strategic_obj_status-edit-form").validate({
		
	});
});
</script>
@endpush
