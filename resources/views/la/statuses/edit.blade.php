@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/statuses') }}">Status</a> :
@endsection
@section("contentheader_description", $status->$view_col)
@section("section", "Statuses")
@section("section_url", url(config('laraadmin.adminRoute') . '/statuses'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Statuses Edit : ".$status->$view_col)

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
				{!! Form::model($status, ['route' => [config('laraadmin.adminRoute') . '.statuses.update', $status->id ], 'method'=>'PUT', 'id' => 'status-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'status_name')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/statuses') }}">Cancel</a></button>
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
	$("#status-edit-form").validate({
		
	});
});
</script>
@endpush
