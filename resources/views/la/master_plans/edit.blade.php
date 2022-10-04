@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/master_plans') }}">Master plan</a> :
@endsection
@section("contentheader_description", $master_plan->$view_col)
@section("section", "Master plans")
@section("section_url", url(config('laraadmin.adminRoute') . '/master_plans'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Master plans Edit : ".$master_plan->$view_col)

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
				{!! Form::model($master_plan, ['route' => [config('laraadmin.adminRoute') . '.master_plans.update', $master_plan->id ], 'method'=>'PUT', 'id' => 'master_plan-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'master-plan')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/master_plans') }}">Cancel</a></button>
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
	$("#master_plan-edit-form").validate({
		
	});
});
</script>
@endpush
