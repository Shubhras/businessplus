@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/management reports') }}">Management Report</a> :
@endsection
@section("contentheader_description", $management report->$view_col)
@section("section", "Management Reports")
@section("section_url", url(config('laraadmin.adminRoute') . '/management reports'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Management Reports Edit : ".$management report->$view_col)

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
				{!! Form::model($management report, ['route' => [config('laraadmin.adminRoute') . '.management reports.update', $management report->id ], 'method'=>'PUT', 'id' => 'management report-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'management_report')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/management reports') }}">Cancel</a></button>
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
	$("#management report-edit-form").validate({
		
	});
});
</script>
@endpush
