@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/status_business_plans') }}">Status business plan</a> :
@endsection
@section("contentheader_description", $status_business_plan->$view_col)
@section("section", "Status business plans")
@section("section_url", url(config('laraadmin.adminRoute') . '/status_business_plans'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Status business plans Edit : ".$status_business_plan->$view_col)

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
				{!! Form::model($status_business_plan, ['route' => [config('laraadmin.adminRoute') . '.status_business_plans.update', $status_business_plan->id ], 'method'=>'PUT', 'id' => 'status_business_plan-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_status')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/status_business_plans') }}">Cancel</a></button>
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
	$("#status_business_plan-edit-form").validate({
		
	});
});
</script>
@endpush
