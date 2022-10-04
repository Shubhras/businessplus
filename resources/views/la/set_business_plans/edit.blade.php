@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/set_business_plans') }}">Set business plan</a> :
@endsection
@section("contentheader_description", $set_business_plan->$view_col)
@section("section", "Set business plans")
@section("section_url", url(config('laraadmin.adminRoute') . '/set_business_plans'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Set business plans Edit : ".$set_business_plan->$view_col)

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
				{!! Form::model($set_business_plan, ['route' => [config('laraadmin.adminRoute') . '.set_business_plans.update', $set_business_plan->id ], 'method'=>'PUT', 'id' => 'set_business_plan-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'menu')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/set_business_plans') }}">Cancel</a></button>
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
	$("#set_business_plan-edit-form").validate({
		
	});
});
</script>
@endpush
