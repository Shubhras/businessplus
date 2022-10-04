@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/initiatives_statuses') }}">Initiatives status</a> :
@endsection
@section("contentheader_description", $initiatives_status->$view_col)
@section("section", "Initiatives statuses")
@section("section_url", url(config('laraadmin.adminRoute') . '/initiatives_statuses'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Initiatives statuses Edit : ".$initiatives_status->$view_col)

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
				{!! Form::model($initiatives_status, ['route' => [config('laraadmin.adminRoute') . '.initiatives_statuses.update', $initiatives_status->id ], 'method'=>'PUT', 'id' => 'initiatives_status-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'initiative_id')
					@la_input($module, 'status_id')
					@la_input($module, 'percentage')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/initiatives_statuses') }}">Cancel</a></button>
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
	$("#initiatives_status-edit-form").validate({
		
	});
});
</script>
@endpush
