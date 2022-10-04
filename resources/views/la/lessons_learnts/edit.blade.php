@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/lessons_learnts') }}">Lessons learnt</a> :
@endsection
@section("contentheader_description", $lessons_learnt->$view_col)
@section("section", "Lessons learnts")
@section("section_url", url(config('laraadmin.adminRoute') . '/lessons_learnts'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Lessons learnts Edit : ".$lessons_learnt->$view_col)

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
				{!! Form::model($lessons_learnt, ['route' => [config('laraadmin.adminRoute') . '.lessons_learnts.update', $lessons_learnt->id ], 'method'=>'PUT', 'id' => 'lessons_learnt-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'test_lessons')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/lessons_learnts') }}">Cancel</a></button>
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
	$("#lessons_learnt-edit-form").validate({
		
	});
});
</script>
@endpush
