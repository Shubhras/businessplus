@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/company_setups') }}">Company setup</a> :
@endsection
@section("contentheader_description", $company_setup->$view_col)
@section("section", "Company setups")
@section("section_url", url(config('laraadmin.adminRoute') . '/company_setups'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Company setups Edit : ".$company_setup->$view_col)

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
				{!! Form::model($company_setup, ['route' => [config('laraadmin.adminRoute') . '.company_setups.update', $company_setup->id ], 'method'=>'PUT', 'id' => 'company_setup-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'text_comapny')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/company_setups') }}">Cancel</a></button>
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
	$("#company_setup-edit-form").validate({
		
	});
});
</script>
@endpush
