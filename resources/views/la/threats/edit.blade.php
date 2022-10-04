@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/threats') }}">Threat</a> :
@endsection
@section("contentheader_description", $threat->$view_col)
@section("section", "Threats")
@section("section_url", url(config('laraadmin.adminRoute') . '/threats'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Threats Edit : ".$threat->$view_col)

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
				{!! Form::model($threat, ['route' => [config('laraadmin.adminRoute') . '.threats.update', $threat->id ], 'method'=>'PUT', 'id' => 'threat-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'threats')
					@la_input($module, 'keywords')
					@la_input($module, 'company_id')
					@la_input($module, 'start_date')
					@la_input($module, 'end_date')
					@la_input($module, 'unit_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/threats') }}">Cancel</a></button>
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
	$("#threat-edit-form").validate({
		
	});
});
</script>
@endpush
