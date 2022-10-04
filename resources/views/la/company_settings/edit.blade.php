@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/company_settings') }}">Company setting</a> :
@endsection
@section("contentheader_description", $company_setting->$view_col)
@section("section", "Company settings")
@section("section_url", url(config('laraadmin.adminRoute') . '/company_settings'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Company settings Edit : ".$company_setting->$view_col)

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
				{!! Form::model($company_setting, ['route' => [config('laraadmin.adminRoute') . '.company_settings.update', $company_setting->id ], 'method'=>'PUT', 'id' => 'company_setting-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'company_id')
					@la_input($module, 'reminder_date')
					@la_input($module, 'financial_year')
					@la_input($module, 'user_id')
					@la_input($module, 'reminder_frequency')
					@la_input($module, 'priority')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/company_settings') }}">Cancel</a></button>
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
	$("#company_setting-edit-form").validate({
		
	});
});
</script>
@endpush
