@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/status_strategic_objs') }}">Status strategic obj</a> :
@endsection
@section("contentheader_description", $status_strategic_obj->$view_col)
@section("section", "Status strategic objs")
@section("section_url", url(config('laraadmin.adminRoute') . '/status_strategic_objs'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Status strategic objs Edit : ".$status_strategic_obj->$view_col)

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
				{!! Form::model($status_strategic_obj, ['route' => [config('laraadmin.adminRoute') . '.status_strategic_objs.update', $status_strategic_obj->id ], 'method'=>'PUT', 'id' => 'status_strategic_obj-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'name')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/status_strategic_objs') }}">Cancel</a></button>
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
	$("#status_strategic_obj-edit-form").validate({
		
	});
});
</script>
@endpush
