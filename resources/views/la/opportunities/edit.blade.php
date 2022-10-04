@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/opportunities') }}">Opportunity</a> :
@endsection
@section("contentheader_description", $opportunity->$view_col)
@section("section", "Opportunities")
@section("section_url", url(config('laraadmin.adminRoute') . '/opportunities'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Opportunities Edit : ".$opportunity->$view_col)

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
				{!! Form::model($opportunity, ['route' => [config('laraadmin.adminRoute') . '.opportunities.update', $opportunity->id ], 'method'=>'PUT', 'id' => 'opportunity-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'opportunities')
					@la_input($module, 'keywords')
					@la_input($module, 'company_id')
					@la_input($module, 'start_date')
					@la_input($module, 'end_date')
					@la_input($module, 'unit_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/opportunities') }}">Cancel</a></button>
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
	$("#opportunity-edit-form").validate({
		
	});
});
</script>
@endpush
