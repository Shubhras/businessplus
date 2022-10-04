@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/management_reports') }}">Management report</a> :
@endsection
@section("contentheader_description", $management_report->$view_col)
@section("section", "Management reports")
@section("section_url", url(config('laraadmin.adminRoute') . '/management_reports'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Management reports Edit : ".$management_report->$view_col)

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
				{!! Form::model($management_report, ['route' => [config('laraadmin.adminRoute') . '.management_reports.update', $management_report->id ], 'method'=>'PUT', 'id' => 'management_report-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'text_test')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/management_reports') }}">Cancel</a></button>
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
	$("#management_report-edit-form").validate({
		
	});
});
</script>
@endpush
