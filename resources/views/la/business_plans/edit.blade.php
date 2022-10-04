@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/business_plans') }}">Business plan</a> :
@endsection
@section("contentheader_description", $business_plan->$view_col)
@section("section", "Business plans")
@section("section_url", url(config('laraadmin.adminRoute') . '/business_plans'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Business plans Edit : ".$business_plan->$view_col)

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
				{!! Form::model($business_plan, ['route' => [config('laraadmin.adminRoute') . '.business_plans.update', $business_plan->id ], 'method'=>'PUT', 'id' => 'business_plan-edit-form']) !!}
					@la_form($module)
					
					{{--

					@la_input($module, 'message_of_ceo')
					@la_input($module, 'vision')
					@la_input($module, 'mission')
					@la_input($module, 'company_id')
					@la_input($module, 'values')
					@la_input($module, 'highlights')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/business_plans') }}">Cancel</a></button>
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
	$("#business_plan-edit-form").validate({
		
	});
});
</script>
@endpush
