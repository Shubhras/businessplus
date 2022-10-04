@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/company_performances') }}">Company performance</a> :
@endsection
@section("contentheader_description", $company_performance->$view_col)
@section("section", "Company performances")
@section("section_url", url(config('laraadmin.adminRoute') . '/company_performances'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Company performances Edit : ".$company_performance->$view_col)

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
				{!! Form::model($company_performance, ['route' => [config('laraadmin.adminRoute') . '.company_performances.update', $company_performance->id ], 'method'=>'PUT', 'id' => 'company_performance-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'menu')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/company_performances') }}">Cancel</a></button>
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
	$("#company_performance-edit-form").validate({
		
	});
});
</script>
@endpush
